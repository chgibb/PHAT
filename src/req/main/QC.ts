import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

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
				fsAccess("resources/app/QC.html"),
				false,false,
				550,150
			)
		);
	}
};