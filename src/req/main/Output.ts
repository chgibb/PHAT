import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function()
{
    winMgr.initWindowOptions(
        "Output",
        "output",
        1379,649,
        false,
        650,420
    );
});

winMgr.windowCreators["output"] = 
{
    Create : function() 
    {
        winMgr.pushWindow(
            "output",
            winMgr.createFromOptions(
                "output",
                "file://"+getReadable("Output.html"),
                false
            )
        );
    }
};
