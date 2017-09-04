import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {getReadable} from "./../getAppPath";
export class InstallUpdate extends atomic.AtomicOperation
{
    public installUpdateJob : cp.ChildProcess;
    public installUpdateFlags : atomic.CompletionFlags;
    public filesInUpdate : number = 0;
    constructor()
    {
        super();
    }
    public setData(data : any)
    {
        this.generatedArtifacts.push("phat-linux-x64.tar.gz");
    }
    public run() : void
    {
        let self = this;
        try
        {
            this.installUpdateJob = cp.fork(getReadable("installUpdate.js"));
            this.addPID(this.installUpdateJob.pid);
            this.installUpdateJob.on
            (
                "message",function(data : any)
                {
                    if(data.totalFiles)
                    {
                        self.filesInUpdate = data.totalFiles;
                        self.update();
                        self.setSuccess(self.flags);
                    }
                }
            );

        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
            return;
        }
    }
}