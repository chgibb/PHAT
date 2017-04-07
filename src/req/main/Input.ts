import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

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
				fsAccess("resources/app/Input.html"),
				false,false, 545, 85
			)
		);
	}
};
