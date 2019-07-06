import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function()
{
    winMgr.initWindowOptions(
        "Circular Genome Builder",
        "circularGenomeBuilder",
        928,300,
        false,
        500,150	
    );
});

winMgr.windowCreators["circularGenomeBuilder"] = 
{
    Create : function() 
    {
        winMgr.pushWindow(
            "circularGenomeBuilder",
            winMgr.createFromOptions(
                "circularGenomeBuilder",
                "file://"+getReadable("circularGenomeBuilder.html"),
                false
            )
        );
    }
};
