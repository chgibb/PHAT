const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess");
var getState = require('./getState');
var postState = require('./postState');
let outputWindow;
ipc.on
(
	"output" ,function(event,arg)
	{
		postState.postStateIPC("output",event,arg);
		getState.getStateIPC("output",event,arg);
	}
);
window.windowCreators["output"] = 
{
	Create : function() 
	{
		window.windows.push
		(
			{
				name : "output",
				window : window.createWithDefault("Output","output",outputWindow,1379,649,fsAccess("resources/app/Output.html"),false)
			}
		);
	}
};
