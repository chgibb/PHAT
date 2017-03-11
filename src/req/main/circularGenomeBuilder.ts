import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";


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
				fsAccess("resources/app/circularGenomeBuilder.html"),
				false,false,
				500,150	
			)
		);
	}
};
