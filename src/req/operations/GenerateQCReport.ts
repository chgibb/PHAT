
import * as atomic from "./atomicOperations";
import {Fastq,parseSeqLengthFromQCReport} from "./../fastq";
import {getQCReportSummaries} from "./../QCReportSummary";
import trimPath from "./../trimPath";
import {SpawnRequestParams} from "./../JobIPC";
import {getPath} from "./../file";
import {getReadable,getReadableAndWritable} from "./../getAppPath";
import {Job,JobCallBackObject} from "./../main/Job";

const fse = require("fs-extra");
export class GenerateQCReport extends atomic.AtomicOperation
{
	public hasJVMCrashed : boolean = false;
	public fastQCPath : string;
	public fastQCJob : Job;
	public fastQCFlags : atomic.CompletionFlags;
	public fastq : Fastq;
	public destDir : string;
	public srcDir : string;
	constructor()
	{
		super();
		this.fastQCFlags = new atomic.CompletionFlags();
	}
	public setData(data : Fastq) : void
	{
		this.fastq = data;

		let trimmed : string = trimPath(getPath(this.fastq));

		let remainder = getPath(this.fastq).substr(0,getPath(this.fastq).length-trimmed.length);

		trimmed = trimmed.replace(new RegExp("(.fastq)","g"),"_fastqc");

		this.generatedArtifactsDirectories.push(remainder+trimmed);
		this.generatedArtifacts.push(remainder+trimmed+".zip");

		this.srcDir = remainder+trimmed;
		this.destDir = getReadableAndWritable("rt/QCReports/"+data.uuid);

		this.destinationArtifactsDirectories.push(this.destDir);
	}
	public run() : void
	{
		this.logRecord = atomic.openLog(this.name,"FastQC Report Generation");
		//Set path to fastqc entry file
		if(process.platform == "linux")
			this.fastQCPath = getReadable("FastQC/fastqc");
		else if(process.platform == "win32")
			this.fastQCPath = getReadable("perl/perl/bin/perl.exe");

		//figure out arg ordering based on platform
		let args : Array<string>;
		if(process.platform == "linux")
			args = [getPath(this.fastq)];
		else if(process.platform == "win32")
			args = [getReadable("FastQC/fastqc"),getPath(this.fastq)];

		//Running FastQC with certain versions of OpenJDK occasionally crash it.
		//One of the first things in the stdout when this happens is "fatal error"
		let isJVMCrashed = new RegExp("(fatal error)","g");
		
		let self = this;
		//On update from spawned FastQC
		let fastQCCallBack : JobCallBackObject = {
			send(channel : string,params : SpawnRequestParams)
			{
				self.logObject(params);
				if(self.flags.done)
					return;			
				if(params.unBufferedData)
				{
					//check for JVM failure on OpenJDK
					if(isJVMCrashed.test(params.unBufferedData))
					{
						self.hasJVMCrashed = true;
						self.abortOperationWithMessage("JVM crashed.");
						return;
					}
				}
				//Check completion
				if(params.done && params.retCode !== undefined)
				{
					//FastQC exited correctly
					if(params.retCode == 0)
						self.setSuccess(self.fastQCFlags);
					//FastQC failed. Mark the entire operation as failed
					else
					{
						self.abortOperationWithMessage("FastQC failed");
						return;
					}
				}
				//If this a regular update from FastQC or something has went wrong
				if(!self.fastQCFlags.success)
				{
					//Forward data through normally
					self.progressMessage = params.unBufferedData;
				 	self.update();
				}
				else if(self.fastQCFlags.success)
				{
					//Wait a second before attempting to copy out what we need
					setTimeout(
						async function()
						{
							try
							{
								fse.copySync(`${self.srcDir}/fastqc_report.html`,`${self.destDir}/fastqc_report.html`);
								fse.copySync(`${self.srcDir}/summary.txt`,`${self.destDir}/summary.txt`);
								fse.copySync(`${self.srcDir}/fastqc_data.txt`,`${self.destDir}/fastqc_data.txt`);
							}
							catch(err)
							{
								self.abortOperationWithMessage(err);
								return;
							}
							try
							{
								self.fastq.QCData.summary = getQCReportSummaries(`${self.destDir}/fastqc_data.txt`);
								self.fastq.QCData.reportRun = true;
							}
							catch(err)
							{
								self.abortOperationWithMessage(`Failed to get summaries for ${self.destDir}/fastqc_data.txt
									${err}`);
								return;
							}
							await parseSeqLengthFromQCReport(self.fastq);
							self.setSuccess(self.flags);
							self.update();
						},1000
					);
				}
			}
		};
		this.fastQCJob = new Job(this.fastQCPath,args,"",true,fastQCCallBack,{});
		try
		{
			this.fastQCJob.Run();
			this.addPID(this.fastQCJob.pid);
		}
		//Failed to spawn job
		catch(err)
		{
			self.abortOperationWithMessage(`${err}`);
			return;
		}
	}
}