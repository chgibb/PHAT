import * as cp from "child_process"

import * as atomic from "./atomicOperations";
import Fastq from "./renderer/fastq";
import trimPath from "./renderer/trimPath";
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

		let self = this;
		//On update from spawned FastQC
		let fastQCCallBack : JobCallBackObject = {
			send(channel : string,params : SpawnRequestParams)
			{
				//Check completion
				if(params.done && params.retCode !== undefined)
				{
					self.done = true;
				}
				//Forward data through
				 self.update(params);

			}
		};
		this.fastQCJob = new Job(this.fastQCPath,args,"",true,fastQCCallBack,{});
		this.fastQCJob.Run();
	}
}