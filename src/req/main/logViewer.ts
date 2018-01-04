import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function(){
	winMgr.initWindowOptions(
		"Log Viewer",
		"logViewer",
		1000,800,
		false,
		500,300
	);
});

winMgr.windowCreators["logViewer"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"logViewer",
			winMgr.createFromOptions(
				"logViewer",
				"file://"+getReadable("logViewer.html"),
				false
			)
		);
	}
};
