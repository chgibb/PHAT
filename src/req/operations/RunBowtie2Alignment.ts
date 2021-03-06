import * as cp from "child_process";

import {AtomicOperationForkEvent} from "../atomicOperationsIPC";
import {getReadable} from "../getAppPath";
import {Fasta,getFaiPath} from "../fasta";
import {Fastq} from "../fastq";
import {getPath} from "../file";
import {AlignData,getArtifactDir} from "../alignData";

import * as atomic from "./atomicOperations";

export interface RunBowtie2AlignmentData
{
    opName : "runBowtie2Alignment";
    fasta : Fasta;
    fastq1 : Fastq;
    fastq2 : Fastq | undefined;
}

export class RunBowtie2Alignment extends atomic.AtomicOperation<RunBowtie2AlignmentData>
{
    public alignData : AlignData;
    public fasta : Fasta;
    public fastq1 : Fastq;
    public fastq2 : Fastq | undefined;

    public runBowtie2AlignmentProcess : cp.ChildProcess | undefined;
    constructor(data : RunBowtie2AlignmentData)
    {
        super(data);

        this.fasta = data.fasta;
        this.fastq1 = data.fastq1;
        this.fastq2 = data.fastq2;

        this.alignData = new AlignData();
        this.alignData.fasta = this.fasta;
        this.alignData.fastqs.push(this.fastq1);
        if(this.fastq2)
            this.alignData.fastqs.push(this.fastq2);
        this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);
        this.destinationArtifactsDirectories.push(getArtifactDir(this.alignData));
    }

    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        let self = this;
        this.runBowtie2AlignmentProcess = atomic.makeFork("RunBowtie2Alignment.js",<AtomicOperationForkEvent>{
            setData : true,
            data : {
                alignData : self.alignData
            },
            name : self.opName,
            description : "Run Bowtie2 Alignment"
        },function(ev : AtomicOperationForkEvent)
        {
            if(ev.finishedSettingData == true)
            {
                self.runBowtie2AlignmentProcess!.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }
            if(ev.pid)
            {
                self.addPID(ev.pid);
                console.log(ev.pid);
            }
            if(ev.update == true)
            {
                self.flags = ev.flags!;
                if(ev.flags!.success == true)
                {
                    self.alignData = ev.data.alignData;
                }
                if(ev.flags!.done)
                {
                    self.logRecord = ev.logRecord;
                    atomic.recordLogRecord(ev.logRecord!);
                }
                self.step = ev.step;
                self.progressMessage = ev.progressMessage;
                console.log(self.step+" "+self.progressMessage);
                self.update!();
            }
        });
        this.addPID(this.runBowtie2AlignmentProcess.pid);
    }
}