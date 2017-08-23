import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import {AlignData} from "./../alignData";
export class InputBamFile extends atomic.AtomicOperation
{
    public bamPath : string;
    public alignData : AlignData;
    public inputBamFileProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(bamPath : string)
    {
        this.bamPath = bamPath;
    }
    public run() : void
    {
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
        let self = this;
        this.inputBamFileProcess = cp.fork(getReadable("InputBamFile.js"));
        self.inputBamFileProcess.on(
            "message",function(ev : AtomicOperationForkEvent){
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
                    if(ev.flags.success == true)
                    {
                        self.alignData = ev.data.alignData;
                    }
                    if(ev.flags.done)
                    {
                        self.logRecord = ev.logRecord;
                        atomic.recordLogRecord(ev.logRecord);
                    }
                    self.progressMessage = ev.progressMessage;
                    self.update();
                }
            }
        );
        setTimeout(
            function(){
                self.inputBamFileProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : {
                            bamPath : self.bamPath
                        },
                        name : self.name,
                        description : "Input Bam File"
                    }
                );
            }
        );
    }
}