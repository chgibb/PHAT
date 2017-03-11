/*const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess").default;*/
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;
import * as winMgr from "./winMgr";
import fsAccess from "./../fsAccess";
import* as dataMgr from "./dataMgr";
ipc.on
(
	"toolBar",function(event,arg)
	{
		if(arg.action === "open")
		{
			winMgr.windowCreators[arg.arg].Create();
		}
	}
);
winMgr.windowCreators["toolBar"] =
{
	Create : function()
	{
		/*window.windows["toolBar"] = toolBarWindow = window.createWithDefault("P. H. A. T.","toolBar",790,64,fsAccess("resources/app/ToolBar.html"),false,false, 500, 64);
		toolBarWindow.on
		(
			'closed',function()
			{
				toolBarWindow = null;
				app.quit();
			}
		);*/
		winMgr.pushWindow(
			"toolBar",
			winMgr.createWithDefault(
				"P. H. A. T.",
				"toolBar",
				790,64,
				fsAccess("resources/app/ToolBar.html"),
				false,false,
				500,64
			)
		);
		let toolBarWindow : Array<Electron.BrowserWindow> = winMgr.getWindowsByName("toolBar");
		if(toolBarWindow.length > 0)
		{
			toolBarWindow[0].on(
				"closed",function()
				{
					dataMgr.saveData();
					app.quit();
				}
			)
		}
	}
};
