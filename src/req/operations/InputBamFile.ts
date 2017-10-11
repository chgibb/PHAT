import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import {AlignData,getArtifactDir} from "./../alignData";
import {Fasta,getFaiPath} from "./../fasta";
import {getPath} from "./../file";
export class InputBamFile extends atomic.AtomicOperation
{
    public bamPath : string;
    public fasta : Fasta;
    public alignData : AlignData;
    public inputBamFileProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(bamPath : string,fasta? : Fasta) : void
    {
        this.bamPath = bamPath;
        this.fasta = fasta;
        if(this.fasta)
            this.generatedArtifacts.push(`${getPath(this.fasta)}.fai`);
    }
    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        let self = this;
        this.inputBamFileProcess = atomic.makeFork("InputBamFile.js",<AtomicOperationForkEvent>{
            setData : true,
            data : {
                bamPath : self.bamPath,
                fastaPath : getPath(self.fasta)
            },
            name : self.name,
            description : "Input Bam File"
        },function(ev : AtomicOperationForkEvent){
            if(ev.finishedSettingData == true)
            {
                self.inputBamFileProcess.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }
            if(ev.update == true)
            {
                self.flags = ev.flags;
                if(ev.flags.done)
                {
                    self.alignData = ev.data.alignData;
                    if(ev.flags.failure == true && self.alignData)
                    {
                        //make sure output dir is deleted on failure
                        self.destinationArtifactsDirectories.push(getArtifactDir(self.alignData));
                    }
                    self.logRecord = ev.logRecord;
                    atomic.recordLogRecord(ev.logRecord);
                }
                self.progressMessage = ev.progressMessage;
                self.update();
            }    
        });
        this.addPID(this.inputBamFileProcess.pid);
    }
}