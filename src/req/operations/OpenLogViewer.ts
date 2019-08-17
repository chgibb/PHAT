import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";

export interface OpenLogViewerData
{
    opName : "openLogViewer";
    logRecordToOpen : atomic.LogRecord;
}

export class OpenLogViewer extends atomic.AtomicOperation<OpenLogViewerData>
{
    public logRecordToOpen : atomic.LogRecord;
    constructor(data : OpenLogViewerData)
    {
        super(data);

        this.logRecordToOpen = data.logRecordToOpen;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog(this.opName,"Open Log Viewer");
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