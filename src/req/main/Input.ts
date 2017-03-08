import * as electron from "electron";
const ipc = electron.ipcMain;
import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";

ipc.on
(
	"input" ,function(event,arg)
	{
		//postState.postStateIPC("input",event,arg);
		//getState.getStateIPC("input",event,arg);
	}
);
winMgr.windowCreators["input"] = 
{
	Create : function() 
	{
		/*window.windows.push
		(
			{
				name : "input",
				window : window.createWithDefault("Input","input",928,300,fsAccess("resources/app/Input.html"),false, false, 500, 150)
			}
		);*/
		winMgr.pushWindow(
			"input",
			winMgr.createWithDefault(
				"Input",
				"input",
				928,300,
				fsAccess("resources/app/Input.html"),
				false,false, 500, 150
			)
		);
	}
};
