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
	constructor()
	{
		super();
	}
	public setData(data : Fastq) : void
	{
		this.fastq = data;

		let trimmed : string = trimPath(this.fastq.name);

		let remainder = this.fastq.name.substr(0,this.fastq.name.length-trimmed.length);

		trimmed = trimmed.replace(new RegExp('(.fastq)','g'),'_fastqc');

		this.generatedArtifactsDirectories.push(remainder+trimmed);
		this.generatedArtifacts.push(remainder+trimmed+".zip");

		let srcDir = remainder+trimmed;
		let destDir = 'resources/app/rt/QCReports/'+makeValidID(Fastq.name);

		this.destinationArtifacts.push(`${destDir}/fastqc_report.html`);
		this.destinationArtifacts.push(`${destDir}/summary.txt`);
		this.destinationArtifacts.push(`${destDir}/fastqc_data.txt`);
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
            args = [this.fastq.name];
        else if(process.platform == "win32")
            args = ['resources/app/FastQC/fastqc',this.fastq.name];

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
								let srcDir = self.generatedArtifactsDirectories[0];
								fse.copySync(`${srcDir}/fastqc_report.html`,self.destinationArtifacts[0]);
								fse.copySync(`${srcDir}/summary.txt`,self.destinationArtifacts[1]);
								fse.copySync(`${srcDir}/fastqc_data.txt`,self.destinationArtifacts[2]);
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