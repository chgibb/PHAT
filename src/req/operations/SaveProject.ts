import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import {ProjectManifest} from "./../projectManifest";

export interface SaveProjectData
{
    opName : "saveProject";

    manifest : ProjectManifest;
}

export class SaveProject extends atomic.AtomicOperation<SaveProjectData>
{
    public proj : ProjectManifest;
    public saveProjectProcess : cp.ChildProcess | undefined;
    constructor(data : SaveProjectData)
    {
        super(data);

        this.proj = data.manifest;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog(this.opName,"Save Project");
        let self = this;
        this.saveProjectProcess = atomic.makeFork("SaveProject.js",<AtomicOperationForkEvent>{
            setData : true,
            data : self.proj
        },function(ev : AtomicOperationForkEvent)
        {
            self.logObject(ev);
            if(ev.finishedSettingData == true)
            {
                self.saveProjectProcess!.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }
            if(ev.update == true)
            {
                self.extraData = ev.data;
                self.flags = ev.flags!;
                if(ev.flags!.success == true)
                {
                    self.setSuccess(self.flags);
                }
                self.update!();
            }
        });
        this.addPID(this.saveProjectProcess.pid);
    }
}