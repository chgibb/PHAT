const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess").default;
var getState = require('./getState');
var postState = require('./postState');

ipc.on
(
	"host" ,function(event,arg)
	{
		postState.postStateIPC("host",event,arg);
		getState.getStateIPC("host",event,arg);
	}
);
window.windowCreators["host"] = 
{
	Create : function() 
	{
		window.windows.push
		(
			{
				name : "host",
				window : window.createWithDefault("Host","host",1000,800,fsAccess("resources/app/Host.html"),false, false, 500, 300)
			}
		);
	}
};
