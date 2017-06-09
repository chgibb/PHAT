import * as winMgr from "./winMgr";
import {getReadable} from "./../getAppPath";

winMgr.windowCreators["QC"] = 
{
	Create : function()
	{
		winMgr.pushWindow(
			"QC",
			winMgr.createWithDefault(
				"Fastq QC",
				"QC",
				1000,
				800,
				"file://"+getReadable("QC.html"),
				false,false,
				550,150
			)
		);
	}
};