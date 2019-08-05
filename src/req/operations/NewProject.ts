import * as atomic from "./atomicOperations";
import {newProject} from "./../newProject";
export class NewProject extends atomic.AtomicOperation
{
    public proj : string;
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
        this.logRecord = atomic.openLog(this.name,"Create New Project");
        let self = this;
        newProject(this.proj).then(() => 
        {

            self.setSuccess(self.flags);
            self.update();

        }).catch((err) => 
        {

            self.abortOperationWithMessage(err);
            self.update();

        });
    }
}