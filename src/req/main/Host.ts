import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

winMgr.windowCreators["host"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"host",
			winMgr.createWithDefault(
				"Host",
				"host",
				1000,800,
				fsAccess("resources/app/host.html"),
				false,false,
				500,300
			)
		);
	}
};
