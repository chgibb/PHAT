import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
export class CheckForUpdate extends atomic.AtomicOperation
{
    public token : string;
    public availableUpdate : boolean;
    public updateTagName : string;

    public checkForUpdateProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(data : AtomicOperationIPC) : void
    {
        this.token = data.token;
    }
    public run() : void
    {
        let self = this;
        this.checkForUpdateProcess = cp.fork(getReadable("CheckForUpdate.js"));
        this.checkForUpdateProcess.on(
            "message",function(ev : AtomicOperationForkEvent)
            {
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
                            token : self.token
                        }
                    }
                );
            },500
        );
    }
}