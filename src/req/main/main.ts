/**
 * Bootstrap module for the main process. Requires helper modules and sets up event handlers.
 * @module req/main/main
 */
import * as fs from "fs";
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const jsonFile = require("jsonfile");

import {Job} from "./Job";
import * as dataMgr from "./dataMgr";
var jobMgr = require('./JobMgr');
import * as winMgr from "./winMgr";
import {menu} from "./appMenu";

import {GetKeyEvent,SaveKeyEvent,KeySubEvent} from "./../ipcEvents";
var keySub = require('./keySub');

var persistState = require('./persistState');

(<any>global).state = {};

require('./toolBar');
require('./Input');
require('./QC');
require('./Align');
require('./Output');
require('./Pathogen');
//require('./Host');
require('./circularGenomeBuilder');
require('./about');

try
{
	dataMgr.loadData("resources/app/rt/rt.json");
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
			fs.mkdirSync("resources/app/cdata");
		}
		catch(err){}
		try
		{
			fs.mkdirSync("resources/app/rt");
			fs.mkdirSync("resources/app/rt/QCReports");
			fs.mkdirSync("resources/app/rt/indexes");
			fs.mkdirSync("resources/app/rt/AlignmentArtifacts");
		}
		catch(err){}
		electron.Menu.setApplicationMenu(menu)

		winMgr.windowCreators["toolBar"].Create();
		setInterval(function(){jobMgr.runJobs();},200);
	}
);
app.on
(
	'window-all-closed',function() 
	{
  		if(process.platform !== 'darwin' || winMgr.getWindowsByName("toolBar").length == 0)
		{
			dataMgr.saveData();
    		app.quit();
  		}
	}
);

app.on
(
	'activate',function()
	{	
		if(winMgr.getWindowsByName("toolBar").length == 0) 
		{
			winMgr.windowCreators["toolBar"].Create();
  		}
	}
)




ipc.on
(
	"getKey",function(event: Electron.IpcMainEvent,arg : GetKeyEvent)
	{
		dataMgr.pushKeyTo(
			arg.channel,
			arg.key,
			arg.replyChannel,
			event.sender
		);
	}
);

ipc.on
(
	"saveKey",function(event : Electron.IpcMainEvent,arg : SaveKeyEvent)
	{
		dataMgr.setKey(
			arg.channel,
			arg.key,
			arg.val
		);

		dataMgr.publishChangeForKey(arg.channel,arg.key);
	}
)


ipc.on
(
	"keySub",function(event,arg)
	{
		if(arg.action == "keySub")
		{
			dataMgr.addSubscriberToKey(
				<KeySubEvent>{
					channel : arg.channel,
					key : arg.key,
					replyChannel : arg.replyChannel
				}
			);
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
