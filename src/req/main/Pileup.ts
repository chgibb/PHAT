import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["pileup"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"pileup",
			winMgr.createWithDefault(
				"Pileup",
				"pileup",
				1000,800,
				"file://"+getReadable("Pileup.html"),
				false,false,
				500,300
			)
		);
	}
};
