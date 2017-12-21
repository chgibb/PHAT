import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";
import {add} from "./afterProjectLoad";

add(function(){
	winMgr.initWindowOptions(
		"Pileup",
		"pileup",
		1000,800,
		false,
		500,300
	);
});

winMgr.windowCreators["pileup"] = 
{
	Create : function() 
	{
		winMgr.pushWindow(
			"pileup",
			winMgr.createFromOptions(
				"pileup",
				"file://"+getReadable("Pileup.html"),
				false
			)
		);
	}
};
