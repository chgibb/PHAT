const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
var window = require('./window');
let toolBarWindow;
ipc.on
(
	"toolBar",function(event,arg)
	{
		if(arg.action === "open")
		{
			//disallow multi windows
			if(!window.windows[arg.arg])
			{
				window.windowCreators[arg.arg].Create();
				return;
			}
			//allow multi windows for QC
			if(arg.arg == "QC")
				window.windowCreators[arg.arg].Create();
			if(arg.arg == "Output")
				window.windowCreators[arg.arg].Create();
		}
	}
);
window.windowCreators["toolBar"] = 
{
	Create : function()
	{
		window.windows["toolBar"] = toolBarWindow = window.createWithDefault("P. H. A. T.","toolBar",toolBarWindow,420,86,"resources/app/ToolBar.html",true,true);
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
