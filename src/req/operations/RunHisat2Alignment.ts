import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "../atomicOperationsIPC";
import {Fasta} from "../fasta";
import {Fastq} from "../fastq";
import {getPath} from "../file";
import {AlignData,getArtifactDir} from "../alignData"

export class RunHisat2Alignment extends atomic.AtomicOperation
{
    public alignData : AlignData;
    public fasta : Fasta;
    public fastq1 : Fastq;
    public fastq2 : Fastq;

    public runHisat2AlignmentProcess : cp.ChildProcess;
    constructor()
    {
        super();
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

            this.alignData = new AlignData();
            this.alignData.fasta = this.fasta;
            this.alignData.fastqs.push(this.fastq1,this.fastq2);
            this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);
            this.destinationArtifactsDirectories.push(getArtifactDir(this.alignData));
        }

    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        let self = this;
        this.runHisat2AlignmentProcess = atomic.makeFork("RunHisat2Alignment.js",<AtomicOperationForkEvent>{
            setData : true,
            data : {
                alignData : self.alignData
            },
            name : self.name,
            description : "Run Hisat2 Alignment"
        },function(ev : AtomicOperationForkEvent){
            if(ev.finishedSettingData == true)
            {
                self.runHisat2AlignmentProcess.send(
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
                self.flags = ev.flags;
                if(ev.flags.success == true)
                {
                    self.alignData = ev.data.alignData;
                }
                if(ev.flags.done)
                {
                    self.logRecord = ev.logRecord;
                    atomic.recordLogRecord(ev.logRecord);
                }
                self.step = ev.step;
                self.progressMessage = ev.progressMessage;
                console.log(self.step+" "+self.progressMessage);
                self.update();
            }
        });
        this.addPID(this.runHisat2AlignmentProcess.pid);
    }
}