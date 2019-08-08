import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
export class OpenLogViewer extends atomic.AtomicOperation<any>
{
    public readonly operationName = "openLogViewer";
    public logRecordToOpen : atomic.LogRecord | undefined;
    constructor()
    {
        super();
    }
    public setData(data : any) : void
    {
        this.logRecordToOpen = data;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.operationName,"Open Log Viewer");
        winMgr.windowCreators["logViewer"].Create();

        let viewers = winMgr.getWindowsByName("logViewer");
        let viewer = viewers[viewers.length - 1];

        let self = this;
        new Promise<void>((resolve,reject) => 
        {
            viewer.webContents.once("did-finish-load",function()
            {
                viewer.webContents.send("logViewer",{logRecord : self.logRecordToOpen});
                resolve();
            });
        }).then(() => 
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