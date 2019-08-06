import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function()
{
    winMgr.initWindowOptions(
        "Operation Viewer",
        "operationViewer",
        1000,800,
        false,
        500,300
    );
});

winMgr.windowCreators["operationViewer"] = 
{
    Create : function() 
    {
        winMgr.pushWindow(
            "operationViewer",
            winMgr.createFromOptions(
                "operationViewer",
                "file://"+getReadable("OperationViewer.html"),
                false
            )
        );
    }
};
