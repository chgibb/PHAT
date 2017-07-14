import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
export class OpenLogViewer extends atomic.AtomicOperation
{
    public logRecord : atomic.LogRecord;
    constructor()
    {
        super();
    }
    public setData(data : any) : void
    {
        this.logRecord = data;
    }
    public run() : void
    {
        this.logKey = atomic.openLog(this.name,"Open Log Viewer");
        winMgr.windowCreators["logViewer"].Create();

        let viewers = winMgr.getWindowsByName("logViewer");
        let viewer = viewers[viewers.length - 1];

        let self = this;
        setTimeout(
            function(){
                viewer.webContents.send("logViewer",{logRecord : self.logRecord});
            },500
        );

        this.setSuccess(this.flags);
        this.update();
    }
}