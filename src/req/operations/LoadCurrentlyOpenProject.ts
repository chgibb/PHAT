import * as atomic from "./atomicOperations";
import {finishLoadingProject} from "./../main/finishLoadingProject";
import {getCurrentlyOpenProject} from "./../getCurrentlyOpenProject";
export class LoadCurrentlyOpenProject extends atomic.AtomicOperation
{
    public constructor()
    {
        super();
    }

    public setData(data : any) : void{}

    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Load Currently Open Project");
        try
        {
            finishLoadingProject(getCurrentlyOpenProject());
            this.setSuccess(this.flags);
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
        }
        this.update();
    }
}