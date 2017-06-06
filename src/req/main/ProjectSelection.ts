import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

winMgr.windowCreators["projectSelection"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"projectSelection",
			winMgr.createWithDefault(
				"ProjectSelection",
				"projectSelection",
				400,800,
				fsAccess("resources/app/ProjectSelection.html"),
				false,false, 10, 10
			)
		);
	}
};