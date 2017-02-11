const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var fsAccess = require("./../fsAccess");
var getState = require('./getState');
var postState = require('./postState');

ipc.on
(
	"QC" ,function(event,arg)
	{
		postState.postStateIPC("QC",event,arg);
		getState.getStateIPC("QC",event,arg);
	}
);
window.windowCreators["QC"] = 
{
	Create : function() 
	{
		window.windows.push
		(
			{
				name : "QC",
				window : window.createWithDefault("Fastq QCs","QC",1000,800,fsAccess("resources/app/QC.html"),false, false, 550, 150)
			}
		);
	}
};
