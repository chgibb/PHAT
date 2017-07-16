import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["logViewer"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"logViewer",
			winMgr.createWithDefault(
				"Log Viewer",
				"logViewer",
				1000,800,
				"file://"+getReadable("logViewer.html"),
				false,false,
				500,300
			)
		);
	}
};
