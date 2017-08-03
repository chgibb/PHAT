import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
export class CheckForUpdate extends atomic.AtomicOperation
{
    public availableUpdate : boolean;
    public updateTagName : string;

    public checkForUpdateProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(data : AtomicOperationIPC) : void
    {
        
    }
    public run() : void
    {
        this.closeLogOnFailure = true;
        this.closeLogOnSuccess = true;
        this.logKey = atomic.openLog(this.name,"Check for Update");
        let self = this;
        this.checkForUpdateProcess = cp.fork(getReadable("CheckForUpdate.js"));
        this.checkForUpdateProcess.on(
            "message",function(ev : AtomicOperationForkEvent)
            {
                self.logObject(ev);
                if(ev.finishedSettingData == true)
                {
                    self.checkForUpdateProcess.send(
                        <AtomicOperationForkEvent>{
                            run : true
                        }
                    );
                }
                if(ev.update == true)
                {
                    self.extraData = ev.data;
                    self.flags = ev.flags;
                    self.update();
                }
            }
        );
        setTimeout(
            function(){
                self.checkForUpdateProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : <AtomicOperationIPC>{
                        }
                    }
                );
            },500
        );
    }
}