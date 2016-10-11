const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
var getState = require('./getState');
var postState = require('./postState');
let inputWindow;
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
		//disallow multiple input windows
		for(var i in window.windows)
		{
			if(window.windows[i].name == "input" && window.windows[i])
				return;
		}
		window.windows.push
		(
			{
				name : "input",
				window : window.createWithDefault("Input","input",inputWindow,928,300,'./../../Input.html',true)
			}
		);
	}
};
