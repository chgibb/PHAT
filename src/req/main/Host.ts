import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

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
				"file://"+getReadable("host.html"),
				false,false,
				500,300
			)
		);
	}
};
