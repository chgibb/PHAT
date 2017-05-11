/**
 * Bootstrap module for the main process. Requires helper modules and sets up event handlers.
 * @module req/main/main
 */
import * as fs from "fs";
import * as cp from "child_process";
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;
if(require('electron-squirrel-startup')) app.quit();

const BrowserWindow = electron.BrowserWindow;
const jsonFile = require("jsonfile");

import {Job} from "./Job";
import * as dataMgr from "./dataMgr";
import * as atomicOp from "./../operations/atomicOperations";
import {AtomicOperationIPC} from "./../atomicOperationsIPC";
import {GenerateQCReport} from "./../operations/GenerateQCReport";
import {IndexFasta} from "./../operations/indexFasta";
import {RunAlignment} from "./../operations/RunAlignment";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {CheckForUpdate} from "./../operations/CheckForUpdate";
import {DownloadAndInstallUpdate} from "./../operations/DownloadAndInstallUpdate";

import * as winMgr from "./winMgr";

import {File} from "./../file";
import alignData from "./../alignData";
import {CircularFigure} from "./../renderer/circularFigure";

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
			fs.mkdirSync("resources/app/rt/circularFigures");
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
		atomicOp.register("runAlignment",RunAlignment);
		atomicOp.register("renderCoverageTrackForContig",RenderCoverageTrackForContig);

		atomicOp.register("checkForUpdate",CheckForUpdate);
		atomicOp.register("downloadAndInstallUpdate",DownloadAndInstallUpdate);		

		setInterval(function(){atomicOp.runOperations(1);},2500);
	}
);
/*
app.on
(
	'window-all-closed',function() 
	{
  		if(process.platform !== 'darwin' || winMgr.getWindowsByName("toolBar").length == 0)
		{
			if(dataMgr.getKey("application","downloadedUpdate"))
			{
				console.log("downloadedUpdate was set");
				let installer = cp.spawn(
                             "python",["resources/app/installUpdate.py"],
                            {
                                detached : true,
                                stdio : [
                                    "ignore","ignore","ignore"
                                ]
                            }
                        );
                        installer.unref();
						console.log("spawned installUpdate.py");
			}
			dataMgr.setKey("application","operations",{});
			console.log("cleared operations");
			dataMgr.saveData();
			console.log("saved data");
    		//app.quit();
  		}
	}
);*/

app.on
(
	'will-quit',function() 
	{
			dataMgr.setKey("application","operations",{});
			console.log("cleared operations");
			dataMgr.saveData();
			console.log("saved data");
			process.exit(0);
    		//app.quit();
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
	"openWindow",function(event : Electron.IpcMainEvent,arg : {refName : string})
	{
		winMgr.windowCreators[arg.refName].Create();
	}
);
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
		if(arg.opName =="indexFasta" || arg.opName == "generateFastQCReport")
		{
			let list : Array<File> = dataMgr.getKey(arg.channel,arg.key);
			for(let i : number = 0; i != list.length; ++i)
			{
				if(list[i].uuid == arg.uuid)
				{
					console.log(`Found ${list[i].path}`);
					let tmp = {};
					Object.assign(tmp,list[i]);
					atomicOp.addOperation(arg.opName,tmp);
					return;
				}
			}
		}
		else if(arg.opName == "runAlignment")
		{
			console.log("running alignment");
			atomicOp.addOperation(
				arg.opName,
				Object.assign({},arg.alignParams)
			);
		}
		else if(arg.opName == "installUpdate")
			atomicOp.addOperation(arg.opName,{});
		else if(arg.opName == "renderCoverageTrackForContig")
		{
			let aligns : Array<alignData> = dataMgr.getKey("align","aligns");
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures",);

			if(aligns && circularFigures)
			{
				let alignData : alignData = <any>{};
				let circularFigure : CircularFigure = <any>{};
				for(let i = 0; i != aligns.length; ++i)
				{
					if(arg.alignuuid == aligns[i].uuid)
					{
						Object.assign(alignData,aligns[i]);
						break;
					}
				}
				for(let i = 0; i != circularFigures.length; ++i)
				{
					if(arg.figureuuid == circularFigures[i].uuid)
					{
						Object.assign(circularFigure,circularFigures[i]);
						break;
					}
				}
				atomicOp.addOperation(
					"renderCoverageTrackForContig",
					{
						circularFigure : circularFigure,
						contiguuid : arg.uuid,
						alignData : alignData,
						colour : arg.colour
					}
				);
			}
		}
		else if(arg.opName == "checkForUpdate")
		{
			let token = "";
			let auth = dataMgr.getKey("application","auth");
			if(auth && auth.token)
				token = auth.token
				console.log("token: "+token);
			atomicOp.addOperation("checkForUpdate",{token : token});
		}
		else if(arg.opName == "downloadAndInstallUpdate")
		{
			let token = "";
			let asset : any = undefined;
			let auth = dataMgr.getKey("application","auth");
			if(auth && auth.token)
				token = auth.token
			//if checkForUpdate was not successful, this will not be set
			asset = dataMgr.getKey("application","availableUpdate");
			if(!asset)
				return;
			atomicOp.addOperation("downloadAndInstallUpdate",
			{
				asset : asset,
				token : token
			});
		}
	}
);
atomicOp.updates.on(
	"indexFasta",function(op : atomicOp.AtomicOperation)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		dataMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let fasta : File = (<IndexFasta>op).fasta;
			let fastaInputs : Array<File> = dataMgr.getKey("input","fastaInputs");
			for(let i = 0; i != fastaInputs.length; ++i)
			{
				if(fastaInputs[i].uuid == fasta.uuid)
				{
					fastaInputs[i] = fasta;
					break;
				}
			}

			dataMgr.setKey("input","fastaInputs",fastaInputs);
			dataMgr.publishChangeForKey("input","fastaInputs");
		}
	}
);
atomicOp.updates.on(
	"generateFastQCReport",function(op : atomicOp.AtomicOperation)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		dataMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let fastq : File = (<GenerateQCReport>op).fastq;
			let fastqInputs : Array<File> = dataMgr.getKey("input","fastqInputs");
			for(let i = 0; i != fastqInputs.length; ++i)
			{
				if(fastqInputs[i].uuid == fastq.uuid)
				{
					fastqInputs[i] = fastq;
					break;
				}
			}

			dataMgr.setKey("input","fastqInputs",fastqInputs);
			dataMgr.publishChangeForKey("input","fastqInputs");
		}
	}
);
atomicOp.updates.on(
	"runAlignment",function(op : RunAlignment)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		dataMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let aligns : Array<alignData> = dataMgr.getKey("align","aligns");
			if(aligns == undefined)
				aligns = new Array<alignData>();

			aligns.push(op.alignData);
			dataMgr.setKey("align","aligns",aligns);
			dataMgr.publishChangeForKey("align","aligns");
		}
	}
);
atomicOp.updates.on(
	"renderCoverageTrackForContig",function(op : RenderCoverageTrackForContig)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		dataMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures");
			for(let i = 0; i != circularFigures.length; ++i)
			{
				if(circularFigures[i].uuid == op.circularFigure.uuid)
				{
					circularFigures[i].renderedCoverageTracks.push(op.circularFigure.renderedCoverageTracks[op.circularFigure.renderedCoverageTracks.length - 1]);
					dataMgr.setKey("circularGenomeBuilder","circularFigures",circularFigures);
					dataMgr.publishChangeForKey("circularGenomeBuilder","circularFigures");
					break;
				}
			}
		}
	}
);

atomicOp.updates.on(
	"checkForUpdate",function(op : CheckForUpdate)
	{
		console.log(op);
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		dataMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			dataMgr.setKey("application","availableUpdate",op.extraData.asset);
		}
	}
);
atomicOp.updates.on(
	"downloadAndInstallUpdate",function(op : DownloadAndInstallUpdate)
	{
		if(op.flags.success)
		{
			dataMgr.setKey("application","downloadedUpdate",true);
			console.log("calling quit");
			app.quit();
		}
	}
)