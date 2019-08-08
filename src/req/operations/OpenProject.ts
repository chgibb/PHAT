import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {getReadable,getWritable,getReadableAndWritable} from "./../getAppPath";
import {ProjectManifest} from "./../projectManifest";
export class OpenProject extends atomic.AtomicOperation<{
    proj : ProjectManifest,
    externalProjectPath : string
}>
{
    public readonly operationName = "openProject";
    public proj : ProjectManifest | undefined;
    public externalProjectPath : string | undefined;
    public openProjectProcess : cp.ChildProcess | undefined;
    constructor()
    {
        super();
    }
    public setData(data : {
        proj : ProjectManifest,
        externalProjectPath : string
    }) : void
    {
        this.proj = data.proj;
        this.externalProjectPath = data.externalProjectPath;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.operationName,"Open Project");
        let self = this;
        this.openProjectProcess = atomic.makeFork("OpenProject.js",<AtomicOperationForkEvent>{
            setData : true,
            data : {
                proj : self.proj,
                externalProjectPath : self.externalProjectPath
            },
            readableBasePath : getReadable(""),
            writableBasePath : getWritable(""),
            readableAndWritableBasePath : getReadableAndWritable("")

        },function(ev : AtomicOperationForkEvent)
        {
            self.logObject(ev);
            if(ev.finishedSettingData == true)
            {
                self.openProjectProcess!.send(
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
        this.addPID(this.openProjectProcess.pid);
    }
}