import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
export class OpenLogViewer extends atomic.AtomicOperation
{
    public logRecord : atomic.LogRecord;
    constructor()
    {
        super();
        this.ignoreScheduler = true;
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
        new Promise<void>((resolve,reject) => {
            viewer.webContents.once("did-finish-load",function(){
                viewer.webContents.send("logViewer",{logRecord : self.logRecord});
                resolve();
            });
        }).then(() => {
            self.setSuccess(self.flags);
            self.update();
        }).catch((err) => {
            self.abortOperationWithMessage(err);
            self.update();
        });
    }
}