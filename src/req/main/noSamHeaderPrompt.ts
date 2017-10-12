import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["noSamHeaderPrompt"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"noSamHeaderPrompt",
			winMgr.createWithDefault(
				"No Sam Header",
				"noSamHeaderPrompt",
				928,300,
				"file://"+getReadable("noSamHeaderPrompt.html"),
				false,false, 545, 85
			)
		);
	}
};
