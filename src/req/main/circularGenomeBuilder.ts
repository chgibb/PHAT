import * as electron from "electron";
const ipc = electron.ipcMain;
import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";


winMgr.windowCreators["circularGenomeBuilder"] = 
{
	Create : function() 
	{
		/*window.windows.push
		(
			{
				name : "circularGenomeBuilder",
				window : window.createWithDefault("circularGenomeBuilder","circularGenomeBuilder",928,300,fsAccess("resources/app/circularGenomeBuilder.html"),false, false, 500, 150)
			}
		);*/
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
