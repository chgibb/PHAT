import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["output"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"output",
			winMgr.createWithDefault(
				"Output",
				"output",
				1379,649,
				"file://"+getReadable("Output.html"),
				false,false,
				650,420
			)
		);
	}
};
