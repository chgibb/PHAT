/**
 * Bootstrap module for the main process. Requires helper modules and sets up event handlers.
 * @module req/main/main
 */
import * as fs from "fs";
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;
if(require('electron-squirrel-startup')) app.quit();
const BrowserWindow = electron.BrowserWindow;
const jsonFile = require("jsonfile");

import {Job} from "./Job";
import * as dataMgr from "./dataMgr";
import * as atomicOp from "./operations/atomicOperations";
import {AtomicOperationIPC} from "./../atomicOperationsIPC";
import {GenerateQCReport} from "./operations/GenerateQCReport";
import {IndexFasta} from "./operations/indexFasta";
import * as winMgr from "./winMgr";

import {File} from "./../file";

import {GetKeyEvent,SaveKeyEvent,KeySubEvent} from "./../ipcEvents";
var keySub = require('./keySub');

var pjson = require('./package.json');

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

		const menuTemplate: Array<Electron.MenuItemOptions> = [
		{
			label: 'File',
			submenu: [
			{
				label: 'Clear workspace', 
				accelerator: 'Control+Shift+Q', 
				click ()  
				{    
					electron.shell.moveItemToTrash("resources/app/rt"); 
					electron.dialog.showMessageBox( 
					{ 
						type: "info", 
						title: 'Important', 
						message: 'You will need to restart PHAT.', 
						detail: 'The workspace data was cleared and will be refreshed on next load.', 
						buttons: ['OK'] 
					});
				} 
			}, 
			{ 
			},
			{
				label: 'Preferences',
				accelerator: 'Control+,'
			},
			{
				type: 'separator'
			},
			{
				label: 'Quit PHAT',
				role: 'quit'
			}
			]
		},
		{
			label: 'View',
			submenu: [
			{
				role: 'resetzoom'
			},
			{
				role: 'zoomin'
			},
			{
				role: 'zoomout'
			},
			{
				type: 'separator'
			},
			{
				role: 'togglefullscreen'
			},
			{
				role: 'toggledevtools'
			}
			]
		},
		{
			role: 'window',
			submenu: [
			{
				role: 'minimize'
			},
			{
				role: 'close'
			}
			]
		},
		{
			role: 'help',
			submenu: [
			{
				label: 'About PHAT',
				click () 
				{ 	
					electron.dialog.showMessageBox(
					{
						type: "info",
						title: 'About PHAT',
						message: 'PHAT version '+pjson.version+'',
						detail: 'PHAT is built in Thunder Bay, Ontario',
						buttons: ['OK', 'End User License Agreement', 'Dependent Open Source Licenses' ]
					},function(response: number) 
					{
						if (response == 1)
							electron.shell.openExternal(''+pjson.repository.url+'/blob/master/TERMS');
						else if (response == 2)
							electron.shell.openExternal(''+pjson.repository.url+'/blob/master/LICENSE');
					});
				}
			},
			{
				label: 'Version '+pjson.version+' (64-bit)',
				enabled: false

			},
			{
				label: 'View Release Notes', 
				click () 
				{ 
					electron.shell.openExternal(''+pjson.repository.url+'/releases/tag/'+pjson.version+'');
				}

			},
			{
				type: 'separator'

			},
			{
				label: 'Send us feedback',
				click () 
				{ 
					electron.shell.openExternal('mailto:'+pjson.author.email+'?subject=PHAT%20Feedback');
				}

			},
			{
				label: 'Get Support',
				click () 
				{ 
					electron.shell.openExternal('mailto:'+pjson.author.email+'?subject=PHAT%20Support');
				}
			},
			{
				type: 'separator'
			},	
			{
				label: 'Learn More',
				click () 
				{ 
					electron.shell.openExternal('http://zehbelab.weebly.com/');
				}
			},
			{
				type: 'separator'
			},	
			{
				label: 'Powered by ZehbeLab',
				submenu: [
					{
						label: ''+pjson.author.name+'',
						click () 
						{ 
							electron.shell.openExternal(''+pjson.author.url+'');
						}
					},
					{
						label: ''+pjson.contributors[0].name+'',
						click () 
						{ 
							electron.shell.openExternal(''+pjson.contributors[0].url+'');
						}
					},
					{
						label: ''+pjson.contributors[1].name+'',
						click () 
						{ 
							electron.shell.openExternal(''+pjson.contributors[1].url+'');
						}
					},
					{
						label: ''+pjson.contributors[2].name+'',
						click () 
						{ 
							electron.shell.openExternal(''+pjson.contributors[2].url+''); 
						}
					}
				]
			}
			]
		}
		];

		const menu = electron.Menu.buildFromTemplate(menuTemplate);
		electron.Menu.setApplicationMenu(menu);

		winMgr.windowCreators["toolBar"].Create();
		
		atomicOp.register("generateFastQCReport",GenerateQCReport);
		atomicOp.register("indexFasta",IndexFasta);

		setInterval(function(){atomicOp.runOperations(1);},2500);
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

ipc.on(
	"runOperation",function(event,arg : AtomicOperationIPC)
	{
		let list : Array<File> = dataMgr.getKey(arg.channel,arg.key);
		for(let i : number = 0; i != list.length; ++i)
		{
			if(list[i].uuid == arg.uuid)
			{
				console.log(`Found ${list[i].path}`);
				atomicOp.addOperation(arg.opName,list[i]);
				return;
			}
		}
	}
);
atomicOp.updates.on(
	"indexFasta",function(oup : atomicOp.OperationUpdate)
	{
		console.log(oup.op.flags);
	}
)

/*ipc.on
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
);*/

