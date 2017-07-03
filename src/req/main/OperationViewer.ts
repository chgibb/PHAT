import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["operationViewer"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"operationViewer",
			winMgr.createWithDefault(
				"Operation Viewer",
				"operationViewer",
				1000,800,
				"file://"+getReadable("OperationViewer.html"),
				true,false,
				500,300
			)
		);
	}
};
