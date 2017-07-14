import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
export class OpenLogViewer extends atomic.AtomicOperation
{
    constructor()
    {
        super();
    }
    public setData(data : any) : void
    {

    }
    public run() : void
    {
        this.logKey = atomic.openLog(this.name,"Open Log Viewer");

        let viewers = winMgr.getWindowsByName("logViewer");
        let viewer = viewers[viewers.length - 1];

        this.setSuccess(this.flags);
        this.update();
    }
}