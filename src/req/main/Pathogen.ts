import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";


winMgr.windowCreators["pathogen"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"pathogen",
			winMgr.createWithDefault(
				"Pathogen",
				"pathogen",
				1000,800,
				fsAccess("resources/app/Pathogen.html"),
				false,false,
				500,300
			)
		);
	}
};
