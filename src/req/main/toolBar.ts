import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import * as dataMgr from "./dataMgr";
import * as atomicOp from "./../operations/atomicOperations";
import {add} from "./afterProjectLoad";

add(function()
{
    winMgr.initWindowOptions(
        "P. H. A. T.",
        "toolBar",
        540,84,
        false,
        540,84
    );
});

winMgr.windowCreators["toolBar"] =
{
    Create : function()
    {
        winMgr.pushWindow(
            "toolBar",
            winMgr.createFromOptions(
                "toolBar",
                "file://"+getReadable("ToolBar.html"),
                false
            )
        );
        let toolBarWindow : Array<Electron.BrowserWindow> = winMgr.getWindowsByName("toolBar");
        if(toolBarWindow.length > 0)
        {
            toolBarWindow[0].on(
                "close",function(e)
                {
                    //Let the download -> install handoff handle app quitting and data saving
                    if(!dataMgr.getKey("application","downloadedUpdate") && !dataMgr.getKey("application","finishedSavingProject"))
                    {
                        dataMgr.saveData();
                        atomicOp.addOperation("saveProject",dataMgr.getKey("application","project"));
                        dataMgr.setKey("application","operations",atomicOp.operationsQueue);
                        winMgr.publishChangeForKey("application","operations");
                        winMgr.closeAllExcept("toolBar");
                        e.preventDefault();
                        //e.returnValue = false;
                    }
                }
            );
        }
    }
};
