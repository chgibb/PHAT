import * as electron from "electron";
const ipc = electron.ipcMain;
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
				false,false, 500, 150
			)
		);
	}
};
