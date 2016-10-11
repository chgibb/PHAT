const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const jsonFile = require('./req/main/jsonfile');
const BrowserWindow = electron.BrowserWindow;

var Job = require('./req/main/Job');
var jobMgr = require('./req/main/JobMgr');
var window = require('./req/main/window');
var keySub = require('./req/main/keySub');

var persistState = require('./req/main/persistState');

global.state = {};

require('./req/main/Toolbar');
require('./req/main/Input');
require('./req/main/QC');
require('./req/main/Align');
require('./req/main/Output');
require('./req/main/Pathogen');

try
{
	state = jsonFile.readFileSync('rt/rt.json');
	console.log("loading");
	if(!state)
		state = {};
	console.log(JSON.stringify(state,undefined,4));
}
catch(err)
{
	console.log(err);
}


app.on
(
	'ready',function()
	{
	}
);

app.on
(
	'activate',function()
	{	
	}
); 

app.on
(
	'ready',function()
	{
		try
		{
			var fs = require("fs");
			fs.mkdirSync("rt");
			fs.mkdirSync("resources/app/rt");
			fs.mkdirSync("resources/app/rt/QCReports");
			fs.mkdirSync("resources/app/rt/indexes");
			fs.mkdirSync("resources/app/rt/AlignmentArtifacts");

		}
		catch(err){}
		window.windowCreators["toolBar"].Create();
		setInterval(function(){jobMgr.runJobs();},200);
	}
);
app.on
(
	'window-all-closed',function() 
	{
  		if(process.platform !== 'darwin' || windows["toolBar"] === null)
		{
			persistState.persistState(true);
    		app.quit();
  		}
	}
);

app.on
(
	'activate',function()
	{	
		if(windows["toolBar"] === null) 
		{
			window.windowCreators["toolBar"]();
  		}
	}
)








ipc.on
(
	"keySub",function(event,arg)
	{
		if(arg.action == "keySub")
		{
			keySub.subToKey(arg.channel,arg.key,arg.replyChannel);
		}
	}
);
ipc.on
(
	"spawnSync",function(event,arg)
	{
		if(arg.action == "spawnSync")
		{
			var spawn = require('child_process');
			if(arg.processName && arg.args)
			{
				var process = spawn.spawnSync(arg.processName,arg.args);
				arg.status = process.status;
				event.sender.send("spawnSyncReply",arg);
			}
		}
	}
); 


ipc.on
(
	"spawn",function(event,arg)
	{
		if(arg.action == "spawn")
		{
			jobMgr.addJob(arg.processName,arg.args,"spawnReply",arg.unBuffer,event.sender,arg.extraData);
			jobMgr.runJobs();
		}
	}
);
