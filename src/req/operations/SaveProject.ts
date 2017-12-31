import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";

import {ProjectManifest} from "./../projectManifest";
export class SaveProject extends atomic.AtomicOperation
{
    public proj : ProjectManifest;
    public saveCurrentProjectProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(data : ProjectManifest)
    {
        this.proj = data;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Save Current Project");
        let self = this;
        this.saveCurrentProjectProcess = atomic.makeFork("SaveCurrentProject.js",<AtomicOperationForkEvent>{
            setData : true,
            data : self.proj
        },function(ev : AtomicOperationForkEvent){
            self.logObject(ev);
            if(ev.finishedSettingData == true)
            {
                self.saveCurrentProjectProcess.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }
            if(ev.update == true)
            {
                self.extraData = ev.data;
                self.flags = ev.flags;
                if(ev.flags.success == true)
                {
                    self.setSuccess(self.flags);
                }
                self.update();
            }
        });
        this.addPID(this.saveCurrentProjectProcess.pid);
    }
}