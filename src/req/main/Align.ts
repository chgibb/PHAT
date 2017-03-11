import * as electron from "electron";
const ipc = electron.ipcMain;
import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

winMgr.windowCreators["align"] = 
{
	Create : function() 
	{
		/*window.windows.push
		(
			{
				name : "align",
				window : window.createWithDefault("Align","align",1000,800,fsAccess("resources/app/Align.html"),false, false, 500, 300)
			}
		);*/
		winMgr.pushWindow(
			"align",
			winMgr.createWithDefault(
				"Align",
				"align",
				1000,800,
				fsAccess("resources/app/Align.html"),
				false,false,
				500,300
			)
		);
	}
};
