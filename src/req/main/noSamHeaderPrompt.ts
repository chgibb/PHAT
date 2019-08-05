import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function()
{
    winMgr.initWindowOptions(
        "No Sam Header",
        "noSamHeaderPrompt",
        928,300,
        false, 545, 85
    );
});

winMgr.windowCreators["noSamHeaderPrompt"] = 
{
    Create : function() 
    {
        winMgr.pushWindow(
            "noSamHeaderPrompt",
            winMgr.createFromOptions(
                "noSamHeaderPrompt",
                "file://"+getReadable("noSamHeaderPrompt.html"),
                false
            )
        );
    }
};
