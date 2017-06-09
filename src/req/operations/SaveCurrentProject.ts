import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";

import {getReadable,getWritable,getReadableAndWritable} from "./../getAppPath";

import {ProjectManifest,manifestsPath} from "./../projectManifest";
export class SaveCurrentProject extends atomic.AtomicOperation
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
        let self = this;
        this.saveCurrentProjectProcess = cp.fork("resources/app/SaveCurrentProject.js");

        self.saveCurrentProjectProcess.on(
            "message",function(ev : AtomicOperationForkEvent)
            {
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
            }
        );
        setTimeout(
            function(){
                self.saveCurrentProjectProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : self.proj,
                        readableBasePath : getReadable(""),
                        writableBasePath : getWritable(""),
                        readableAndWritableBasePath : getReadableAndWritable("")
                    }
                );
            },500
        );

    }
}