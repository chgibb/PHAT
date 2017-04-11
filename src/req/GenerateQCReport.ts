import * as cp from "child_process"

const fse = require("fs-extra");

import * as atomic from "./atomicOperations";
import Fastq from "./renderer/fastq";
import trimPath from "./renderer/trimPath";
import {makeValidID} from "./renderer/MakeValidID";
import {SpawnRequestParams} from "./JobIPC";

import {Job,JobCallBackObject} from "./main/Job";
export class GenerateQCReport extends atomic.AtomicOperation
{
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

		let trimmed : string = trimPath(this.fastq.path);

		let remainder = this.fastq.path.substr(0,this.fastq.path.length-trimmed.length);

		trimmed = trimmed.replace(new RegExp('(.fastq)','g'),'_fastqc');

		this.generatedArtifactsDirectories.push(remainder+trimmed);
		this.generatedArtifacts.push(remainder+trimmed+".zip");

		this.srcDir = remainder+trimmed;
		this.destDir = 'resources/app/rt/QCReports/'+data.uuid;

		this.destinationArtifactsDirectories.push(this.destDir);
	}
	public run() : void
	{
		//Set path to fastqc entry file
		if(process.platform == "linux")
            this.fastQCPath = 'resources/app/FastQC/fastqc';
        else if(process.platform == "win32")
            this.fastQCPath = 'resources/app/perl/perl/bin/perl.exe';

		//figure out arg ordering based on platform
		let args : Array<string>;
        if(process.platform == "linux")
            args = [this.fastq.path];
        else if(process.platform == "win32")
            args = ['resources/app/FastQC/fastqc',this.fastq.path];

		//Running FastQC with certain versions of OpenJDK occasionally crash it.
		//One of the first things in the stdout when this happens is "fatal error"
		let isJVMCrashed = new RegExp("(fatal error)","g");
		let self = this;
		//On update from spawned FastQC
		let fastQCCallBack : JobCallBackObject = {
			send(channel : string,params : SpawnRequestParams)
			{
				if(params.unBufferedData)
				{
					//check for JVM failure on OpenJDK
					if(isJVMCrashed.test(params.unBufferedData))
					{
						//set operations flags accordingly
						self.setFailure(self.flags);
					}
				}
				//Check completion
				if(params.done && params.retCode !== undefined)
				{
					//if we haven't already set completion due to a crash 
					if(!self.flags.done)
					{
						//FastQC exited correctly
						if(params.retCode == 0)
							self.setSuccess(self.fastQCFlags);
						//FastQC failed. Mark the entire operation as failed
						else
							self.setFailure(self.flags);
					}
				}
				//If this a regular update from FastQC or something has went wrong
				if(!self.fastQCFlags.success)
				{
					//Forward data through normally
					let oup : atomic.OperationUpdate = <atomic.OperationUpdate>{
						spawnUpdate : params,
						flags : self.flags
					}
				 	self.update(oup);
				}
				else if(self.fastQCFlags.success)
				{
					//Wait a second before attempting to copy out what we need
					setTimeout(
						function()
						{
							try
							{
								fse.copySync(`${self.srcDir}/fastqc_report.html`,`${self.destDir}/fastqc_report.html`);
								fse.copySync(`${self.srcDir}/summary.txt`,`${self.destDir}/summary.txt`);
								fse.copySync(`${self.srcDir}/fastqc_data.txt`,`${self.destDir}/fastqc_data.txt`);
							}
							catch(err)
							{
								self.setFailure(self.flags);
								self.update(<atomic.OperationUpdate>{
									flags : self.flags,
									extraData : err
								});
								return;
							}
							self.setSuccess(self.flags);
							self.update(<atomic.OperationUpdate>{
								flags : self.flags,
							});
						},1000
					);
				}
			}
		};
		this.fastQCJob = new Job(this.fastQCPath,args,"",true,fastQCCallBack,{});
		try
		{
			this.fastQCJob.Run();
		}
		//Failed to spawn job
		catch(err)
		{
			self.setFailure(self.flags);
			let oup : atomic.OperationUpdate = <atomic.OperationUpdate>{
				flags : self.flags,
				//Forward error message from failed to spawn exception through
				extraData : err
			}
			self.update(oup);
		}
	}
}