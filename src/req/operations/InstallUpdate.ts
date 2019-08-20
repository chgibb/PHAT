import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {getReadable} from "./../getAppPath";

export interface InstallUpdateData {
    opName: "installUpdate";
}

export class InstallUpdate extends atomic.AtomicOperation<InstallUpdateData>
{
    public installUpdateJob: cp.ChildProcess | undefined;
    public installUpdateFlags: atomic.CompletionFlags | undefined;
    public filesInUpdate: number = 0;
    constructor(data: InstallUpdateData) 
    {
        super(data);
        this.generatedArtifacts.push("phat-linux-x64.tar.gz");
    }

    public run(): void 
    {
        let self = this;
        try 
        {
            this.installUpdateJob = atomic.makeFork("installUpdate.js", {}, function (data: any) 
            {
                if (data.totalFiles) 
                {
                    self.filesInUpdate = data.totalFiles;
                    self.update!();
                    self.setSuccess(self.flags);
                }
            });
            this.addPID(this.installUpdateJob.pid);

        }
        catch (err) 
        {
            this.abortOperationWithMessage(err);
            return;
        }
    }
}