import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["noSamHeader"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"noSamHeader",
			winMgr.createWithDefault(
				"No Sam Header",
				"noSamHeader",
				928,300,
				"file://"+getReadable("noSamHeader.html"),
				false,false, 545, 85
			)
		);
	}
};
