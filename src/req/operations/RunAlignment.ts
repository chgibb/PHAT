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
            fastq2 : Fastq
        }) : void
        {
            this.fasta = data.fasta;
            this.fastq1 = data.fastq1;
            this.fastq2 = data.fastq2;
            this.alignData = new alignData();
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
            }
        };
    }

}