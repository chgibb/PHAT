const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess").default;
var getState = require('./getState');
var postState = require('./postState');

ipc.on
(
	"input" ,function(event,arg)
	{
		postState.postStateIPC("input",event,arg);
		getState.getStateIPC("input",event,arg);
	}
);
window.windowCreators["input"] = 
{
	Create : function() 
	{
		window.windows.push
		(
			{
				name : "input",
				window : window.createWithDefault("Input","input",928,300,fsAccess("resources/app/Input.html"),false, false, 500, 150)
			}
		);
	}
};
