import * as electron from "electron";
const ipc = electron.ipcMain;
import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

winMgr.windowCreators["output"] = 
{
	Create : function() 
	{
		/*window.windows.push
		(
			{
				name : "output",
				window : window.createWithDefault("Output","output",1379,649,fsAccess("resources/app/Output.html"),false, false, 650, 420)
			}
		);*/
		winMgr.pushWindow(
			"output",
			winMgr.createWithDefault(
				"Output",
				"output",
				1379,649,
				fsAccess("resources/app/Output.html"),
				false,false,
				650,420
			)
		);
	}
};
