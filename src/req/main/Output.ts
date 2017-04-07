import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

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
				fsAccess("resources/app/Output.html"),
				false,false,
				650,420
			)
		);
	}
};
