import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";


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
				"file://"+getReadable("Pathogen.html"),
				false,false,
				500,300
			)
		);
	}
};
