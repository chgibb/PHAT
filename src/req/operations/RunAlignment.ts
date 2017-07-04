import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import {Fasta,getFaiPath} from "./../fasta";
import Fastq from "./../fastq";
import {getPath} from "./../file";
import {alignData,getArtifactDir} from "./../alignData"

export class RunAlignment extends atomic.AtomicOperation
{
    public alignData : alignData;
    public fasta : Fasta;
    public fastq1 : Fastq;
    public fastq2 : Fastq;

    public runAlignmentProcess : cp.ChildProcess;
    constructor()
    {
        super();
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
            this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);
            this.destinationArtifactsDirectories.push(getArtifactDir(this.alignData));
        }

    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        let self = this;
        this.runAlignmentProcess = cp.fork(getReadable("RunAlignment.js"));
        self.runAlignmentProcess.on(
            "message",function(ev : AtomicOperationForkEvent){
                if(ev.finishedSettingData == true)
                {
                    self.runAlignmentProcess.send(
                        <AtomicOperationForkEvent>{
                            run : true
                        }
                    );
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
                        atomic.recordLogRecord(ev.logRecord);
                    }
                    self.step = ev.step;
                    self.progressMessage = ev.progressMessage;
                    console.log(self.step+" "+self.progressMessage);
                    self.update();
                }
            }
        );
        setTimeout(
            function(){
                self.runAlignmentProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : {
                            alignData : self.alignData
                        },
                        name : self.name,
                        description : "Run Alignment"
                    }
                );
            },500
        );
    }
}