import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function(){
	winMgr.initWindowOptions(
		"Align",
		"align",
		843,676,
		false,
		500,300
	);
});

winMgr.windowCreators["align"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"align",
			winMgr.createFromOptions(
				"align",
				"file://"+getReadable("Align.html"),
				false
			)
		);
	}
};
