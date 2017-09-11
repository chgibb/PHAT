import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import {getPath} from "../file";
import {AlignData} from "./../alignData";
import {Fasta} from "./../fasta";
export class LinkRefSeqToAlignment extends atomic.AtomicOperation
{
    public alignData : AlignData;
    public fasta : Fasta;
    public linkRefSeqToAlignmentProcess : cp.ChildProcess;
    public constructor()
    {
        super();
    }
    public setData(data : any) : void
    {
        this.alignData = data.align;
        this.fasta = data.fasta;  
        this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);
    }
    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        let self = this;
        this.linkRefSeqToAlignmentProcess = atomic.makeFork("LinkRefSeqToAlignment.js",<AtomicOperationForkEvent>{
            setData : true,
            data : {
                align : self.alignData,
                fasta : self.fasta
            },
            name : self.name,
            description : "Link Ref Seq To Alignment"
        },function(ev : AtomicOperationForkEvent){
            if(ev.finishedSettingData == true)
            {
                self.linkRefSeqToAlignmentProcess.send(
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
                    self.logRecord = ev.logRecord;
                    atomic.recordLogRecord(ev.logRecord);
                }
                self.step = ev.step;
                self.progressMessage = ev.progressMessage;
                console.log(self.step+" "+self.progressMessage);
                self.update();
            }
        });
        this.addPID(this.linkRefSeqToAlignmentProcess.pid);
    }
}