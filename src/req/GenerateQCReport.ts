import * as cp from "child_process"

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
						self.setFailure();
					}
				}
				//Check completion
				if(params.done && params.retCode !== undefined)
				{
					//if we haven't already set completion due to a crash 
					if(!self.done)
					{
						if(params.retCode == 0)
							self.setSuccess();
						else
							self.setFailure();
					}
				}
				//Forward data through
				let oup : atomic.OperationUpdate = <atomic.OperationUpdate>{
					spawnUpdate : params,
					done : self.done,
					success : self.success,
					failure : self.failure,
				}
				 self.update(oup);

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
			self.done = true;
			self.failure = true;
			let oup : atomic.OperationUpdate = <atomic.OperationUpdate>{
				done : self.done,
				success : self.success,
				failure : self.failure,
				//Forward error message from failed to spawn exception through
				extraData : err
			}
			self.update(oup);
		}
	}
}