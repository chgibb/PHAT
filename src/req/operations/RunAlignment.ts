import * as fs from "fs";

import * as atomic from "./atomicOperations";
import {Fasta} from "./../fasta";
import Fastq from "./../fastq";
import alignData from "./../alignData"
import {SpawnRequestParams} from "./../JobIPC";
import {Job,JobCallBackObject} from "./../main/Job";

export class RunAlignment extends atomic.AtomicOperation
{
    public alignData : alignData;
    public fasta : Fasta;
    public fastq1 : Fastq;
    public fastq2 : Fastq;

    public samToolsExe : string;
    public bowtie2Exe : string;

    public bowtieJob : Job;
    public samToolsIndexJob : Job;
    public samToolsSortJob : Job;
    public samToolsViewJob : Job;

    public bowtieFlags : atomic.CompletionFlags;
    public samToolsIndexFlags : atomic.CompletionFlags;
    public samToolsSortFlags : atomic.CompletionFlags;
    public samToolsViewFlags : atomic.CompletionFlags;
    constructor()
    {
        super();

        this.bowtieFlags = new atomic.CompletionFlags();
        this.samToolsIndexFlags = new atomic.CompletionFlags();
        this.samToolsSortFlags = new atomic.CompletionFlags();
        this.samToolsViewFlags = new atomic.CompletionFlags();

        this.samToolsExe = 'resources/app/samtools';
        if(process.platform == "linux")
            this.bowtie2Exe = 'resources/app/bowtie2';
        else if(process.platform == "win32")
            this.bowtie2Exe = 'resources/app/python/python.exe';
    }
    public setData(
        data : {
            fasta : Fasta,
            fastq1 : Fastq,
            fastq2 : Fastq,
            type : string
        }) : void
        {
            this.fasta = data.fasta;
            this.fastq1 = data.fastq1;
            this.fastq2 = data.fastq2;
            this.alignData = new alignData();
            this.alignData.type = data.type;
            this.alignData.fasta = this.fasta;
            this.alignData.fastqs.push(this.fastq1,this.fastq2);
            this.destinationArtifactsDirectories.push(`resources/app/AlignmentArtifacts/${this.alignData.uuid}`);
        }
    public run() : void
    {
        let self = this;
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(self.flags.done)
                    return;
                self.spawnUpdate = params;
                self.update();
            }
        };
        let args : Array<string> = new Array<string>();
        if(process.platform == "win32")
            args.push("resources/app/bowtie2");
        args.push("-x");
        args.push(`resources/app/indexes/${this.fasta.uuid}`);
        args.push("-1");
        args.push(this.fastq1.path);
        args.push("-2");
        args.push(this.fastq2.path);
        args.push("-S");
        args.push(`resources/app/AlignmentArtifacts/${this.alignData.uuid}/out.sam`);

        let invokeString = "";
        for(let i = 0; i != args.length; ++i)
        {
            invokeString += args[i];
            invokeString += " ";
        }
        this.alignData.invokeString = invokeString;
        this.alignData.alias = `${this.fastq1.alias}, ${this.fastq2.alias}; ${this.fasta.alias}`;

        this.bowtieJob = new Job(this.bowtie2Exe,args,"",true,jobCallBack,{});
        try
        {
            this.bowtieJob.Run();
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
            return;
        }
        this.update();
    }

}