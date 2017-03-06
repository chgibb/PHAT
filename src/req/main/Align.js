const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess").default;
var getState = require('./getState');
var postState = require('./postState');

ipc.on
(
	"align" ,function(event,arg)
	{
		postState.postStateIPC("align",event,arg);
		getState.getStateIPC("align",event,arg);
	}
);
window.windowCreators["align"] = 
{
	Create : function() 
	{
		window.windows.push
		(
			{
				name : "align",
				window : window.createWithDefault("Align","align",1000,800,fsAccess("resources/app/Align.html"),false, false, 500, 300)
			}
		);
	}
};
