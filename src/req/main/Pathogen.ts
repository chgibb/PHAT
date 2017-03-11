import * as electron from "electron";
const ipc = electron.ipcMain;
import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";


winMgr.windowCreators["pathogen"] = 
{
	Create : function() 
	{
		/*window.windows.push
		(
			{
				name : "pathogen",
				window : window.createWithDefault("Pathogen","pathogen",1000,800,fsAccess("resources/app/Pathogen.html"),false, false, 500, 300)
			}
		);*/
		winMgr.pushWindow(
			"pathogen",
			winMgr.createWithDefault(
				"Pathogen",
				"pathogen",
				1000,800,
				fsAccess("resources/app/Pathogen.html"),
				false,false,
				500,300
			)
		);
	}
};
