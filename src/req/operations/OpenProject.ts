import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";

import {getReadable,getWritable,getReadableAndWritable} from "./../getAppPath";

import {ProjectManifest} from "./../projectManifest";
export class OpenProject extends atomic.AtomicOperation
{
    public proj : ProjectManifest;
    public externalProjectPath : string;
    public openProjectProcess : cp.ChildProcess;
    constructor()
    {
        super();
        this.ignoreScheduler = true;
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
        this.logKey = atomic.openLog(this.name,"Open Project");
        let self = this;
        this.openProjectProcess = cp.fork(getReadable("OpenProject.js"));

        self.openProjectProcess.on(
            "message",function(ev : AtomicOperationForkEvent)
            {
                self.logObject(ev);
                if(ev.finishedSettingData == true)
                {
                    self.openProjectProcess.send(
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
            }
        );
        setTimeout(
            function(){
                self.openProjectProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : {
                            proj : self.proj,
                            externalProjectPath : self.externalProjectPath
                        },
                        readableBasePath : getReadable(""),
                        writableBasePath : getWritable(""),
                        readableAndWritableBasePath : getReadableAndWritable("")

                    }
                );
            },10
        );

    }
}