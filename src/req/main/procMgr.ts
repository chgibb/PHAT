import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function()
{
    winMgr.initWindowOptions(
        "Process Manager",
        "procMgr",
        543,331,
        false,
        0,0
    );
});

winMgr.windowCreators["procMgr"] = 
{
    Create : function()
    {
        winMgr.pushWindow(
            "procMgr",
            winMgr.createFromOptions(
                "procMgr",
                "file://"+getReadable("procMgr.html"),
                false
            )
        );
    }
};
