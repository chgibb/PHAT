import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function(){
	winMgr.initWindowOptions(
		"Input",
		"input",
		928,300,
		false,
		545,85
	);
});

winMgr.windowCreators["input"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"input",
			winMgr.createFromOptions(
				"input",
				"file://"+getReadable("Input.html"),
				false
			)
		);
	}
};
