const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess");

ipc.on
(
	"toolBar",function(event,arg)
	{
		if(arg.action === "open")
		{
			window.windowCreators[arg.arg].Create();
		}
	}
);
window.windowCreators["toolBar"] = 
{
	Create : function()
	{
		window.windows["toolBar"] = toolBarWindow = window.createWithDefault("P. H. A. T.","toolBar",450,86,fsAccess("resources/app/ToolBar.html"),true,false);
		toolBarWindow.on
		(
			'closed',function()
			{
				toolBarWindow = null;
				app.quit();
			}
		);
	}
};
