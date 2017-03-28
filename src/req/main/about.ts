import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

winMgr.windowCreators["about"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"about",
			winMgr.createWithDefault(
				"About PHAT",
				"about",
				400,400,
				fsAccess("resources/app/About.html"),
				false,false,
				400,400
			)
		);
	}
};