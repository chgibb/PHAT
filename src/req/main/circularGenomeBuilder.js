const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess");
var getState = require('./getState');
var postState = require('./postState');
ipc.on
(
	"circularGenomeBuilder" ,function(event,arg)
	{
		postState.postStateIPC("circularGenomeBuilder",event,arg);
		getState.getStateIPC("circularGenomeBuilder",event,arg);
	}
);
window.windowCreators["circularGenomeBuilder"] = 
{
	Create : function() 
	{
		window.windows.push
		(
			{
				name : "circularGenomeBuilder",
				window : window.createWithDefault("circularGenomeBuilder","circularGenomeBuilder",1000,800,fsAccess("resources/app/circularGenomeBuilder.html"),true)
			}
		);
	}
};
