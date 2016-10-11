const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var getState = require('./getState');
var postState = require('./postState');
let alignWindow;
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
				window : window.createWithDefault("Align","align",alignWindow,1000,800,'./../../Align.html',true)
			}
		);
	}
};
