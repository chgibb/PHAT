import * as atomic from "./atomicOperations";
import {newProject} from "./../newProject";

export interface NewProjectData
{
    opName : "newProject";
    projName : string;
}

export class NewProject extends atomic.AtomicOperation<NewProjectData>
{
    public proj : string;
    constructor(data : NewProjectData)
    {
        super(data);

        this.proj = data.projName;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog(this.opName,"Create New Project");
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