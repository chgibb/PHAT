const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess");
var getState = require('./getState');
var postState = require('./postState');
let pathogenWindow;
ipc.on
(
	"pathogen" ,function(event,arg)
	{
		postState.postStateIPC("pathogen",event,arg);
		getState.getStateIPC("pathogen",event,arg);
	}
);
window.windowCreators["pathogen"] = 
{
	Create : function() 
	{
		window.windows.push
		(
			{
				name : "pathogen",
				window : window.createWithDefault("Pathogen","pathogen",pathogenWindow,1000,800,fsAccess("resources/app/Pathogen.html"),false)
			}
		);
	}
};
