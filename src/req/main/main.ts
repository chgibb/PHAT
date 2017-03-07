/**
 * Bootstrap module for the main process. Requires helper modules and sets up event handlers.
 * @module req/main/main
 */
/*var fs = require("fs");
const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const jsonFile = require('jsonfile');
const BrowserWindow = electron.BrowserWindow;*/
import * as fs from "fs";
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const jsonFile = require("jsonfile");


var Job = require('./Job');
var jobMgr = require('./JobMgr');
var window = require('./window');
var keySub = require('./keySub');

var persistState = require('./persistState');

global.state = {};

require('./Toolbar');
require('./Input');
require('./QC');
require('./Align');
require('./Output');
require('./Pathogen');
require('./Host');
require('./circularGenomeBuilder');

try
{
	state = jsonFile.readFileSync('resources/app/rt/rt.json');
	console.log("loading");
	if(!state)
		state = {};
	console.log(JSON.stringify(state,undefined,4));
}
catch(err)
{
	
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
