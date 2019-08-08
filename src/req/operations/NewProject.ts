import * as atomic from "./atomicOperations";
import {newProject} from "./../newProject";
export class NewProject extends atomic.AtomicOperation<string>
{
    public readonly operationName = "newProject";
    public proj : string | undefined;
    constructor()
    {
        super();
    }
    public setData(data : string) : void
    {
        this.proj = data;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.operationName,"Create New Project");
        let self = this;
        newProject(this.proj!).then(() => 
        {

            self.setSuccess(self.flags);
            self.update!();

        }).catch((err) => 
        {

            self.abortOperationWithMessage(err);
            self.update!();

        });
    }
}