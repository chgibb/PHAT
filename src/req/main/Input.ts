import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["input"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"input",
			winMgr.createWithDefault(
				"Input",
				"input",
				928,300,
				"file://"+getReadable("Input.html"),
				false,false, 545, 85
			)
		);
	}
};
