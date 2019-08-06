import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function()
{
    winMgr.initWindowOptions(
        "Fastq QC",
        "QC",
        1000,
        800,
        false,
        550,150
    );
});

winMgr.windowCreators["QC"] = 
{
    Create : function()
    {
        winMgr.pushWindow(
            "QC",
            winMgr.createFromOptions(
                "QC",
                "file://"+getReadable("QC.html"),
                false
            )
        );
    }
};

