import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["circularGenomeBuilder"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"circularGenomeBuilder",
			winMgr.createWithDefault(
				"circularGenomeBuilder",
				"circularGenomeBuilder",
				928,300,
				"file://"+getReadable("circularGenomeBuilder.html"),
				false,false,
				500,150	
			)
		);
	}
};
