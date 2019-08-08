import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";

export interface CheckForUpdateData
{
    operationName : "checkForUpdate";
    data : AtomicOperationIPC;
}

export class CheckForUpdate extends atomic.AtomicOperation<CheckForUpdateData>
{
    public availableUpdate : boolean | undefined;
    public updateTagName : string | undefined;

    public checkForUpdateProcess : cp.ChildProcess | undefined;
    constructor(data : CheckForUpdateData)
    {
        super(data);
    }

    public run() : void
    {
        this.closeLogOnFailure = true;
        this.closeLogOnSuccess = true;
        this.logRecord = atomic.openLog(this.operationName,"Check for Update");
        let self = this;
        this.checkForUpdateProcess = atomic.makeFork("CheckForUpdate.js",<AtomicOperationForkEvent>{
            setData : true,
            data : <AtomicOperationIPC>{}
        },function(ev : AtomicOperationForkEvent)
        {
            self.logObject(ev);
            if(ev.finishedSettingData == true)
            {
                self.checkForUpdateProcess!.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }
            if(ev.update == true)
            {
                self.extraData = ev.data;
                self.flags = ev.flags!;
                self.update!();
            }    
        });
        this.addPID(this.checkForUpdateProcess.pid);
    }
}