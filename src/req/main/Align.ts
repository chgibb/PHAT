import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["align"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"align",
			winMgr.createWithDefault(
				"Align",
				"align",
				1000,800,
				"file://"+getReadable("Align.html"),
				false,false,
				500,300
			)
		);
	}
};
