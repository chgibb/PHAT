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
import * as dataMgr from "./dataMgr";
winMgr.windowCreators["toolBar"] =
{
	Create : function()
	{
		winMgr.pushWindow(
			"toolBar",
			winMgr.createWithDefault(
				"P. H. A. T.",
				"toolBar",
				540,84,
				fsAccess("resources/app/ToolBar.html"),
				false,false,
				540,84
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
