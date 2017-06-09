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


console.log("app Path: "+app.getAppPath());
console.log("app data: "+app.getPath("appData"));
console.log("user data: "+app.getPath("userData"));

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
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CheckForUpdate} from "./../operations/CheckForUpdate";
import {DownloadAndInstallUpdate} from "./../operations/DownloadAndInstallUpdate";

import {ProjectManifest,manifestsPath} from "./../projectManifest";

import {NewProject} from "./../operations/NewProject";
import {OpenProject} from "./../operations/OpenProject";
import {SaveCurrentProject} from "./../operations//SaveCurrentProject";

import * as winMgr from "./winMgr";

import {File} from "./../file";
import {rebuildRTDirectory} from "./rebuildRTDirectory";
import alignData from "./../alignData";
import {CircularFigure} from "./../renderer/circularFigure";

import {GetKeyEvent,SaveKeyEvent,KeySubEvent} from "./../ipcEvents";
var keySub = require('./keySub');

var pjson = require('./package.json');

var persistState = require('./persistState');

(<any>global).state = {};

require('./ProjectSelection');
require('./toolBar');
require('./Input');
require('./QC');
require('./Align');
require('./Output');
require('./Pathogen');
//require('./Host');
require('./circularGenomeBuilder');

//final steps to load project after OpenProject operation has unpacked the project tarball
function finishLoadingProject(proj : ProjectManifest) : void
{
	atomicOp.clearOperationsQueue();

	dataMgr.clearData();
	dataMgr.loadData("resources/app/rt/rt.json");
	dataMgr.setKey("application","project",proj);
	let jobErrorLog = dataMgr.getKey("application","jobErrorLog");
	let jobVerboseLog = dataMgr.getKey("application","jobVerboseLog");

	try
	{
		fs.unlink(jobErrorLog,function(err : NodeJS.ErrnoException){});
		fs.unlink(jobVerboseLog,function(err : NodeJS.ErrnoException){});
	}
	catch(err){}

	dataMgr.setKey("application","jobErrorLog","jobErrorLog.txt");
	dataMgr.setKey("application","jobVerboseLog","jobVerboseLog.txt");

	winMgr.windowCreators["toolBar"].Create();
	winMgr.closeAllExcept("toolBar");
}

try
{
	dataMgr.loadData("resources/app/rt/rt.json");
}
catch(err)
{
	
}
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
					electron.shell.openExternal("https://github.com/chgibb/PHAT/issues");
				}

			},
			{
				label: 'Get Support',
				click () 
				{ 
					electron.shell.openExternal("https://github.com/chgibb/PHAT/issues");
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

		winMgr.windowCreators["projectSelection"].Create();
		
		atomicOp.register("generateFastQCReport",GenerateQCReport);
		atomicOp.register("indexFasta",IndexFasta);
		atomicOp.register("runAlignment",RunAlignment);
		atomicOp.register("renderCoverageTrackForContig",RenderCoverageTrackForContig);
		atomicOp.register("renderSNPTrackForContig",RenderSNPTrackForContig);

		atomicOp.register("checkForUpdate",CheckForUpdate);
		atomicOp.register("downloadAndInstallUpdate",DownloadAndInstallUpdate);

		atomicOp.register("newProject",NewProject);
		atomicOp.register("openProject",OpenProject);
		atomicOp.register("saveCurrentProject",SaveCurrentProject);	

		setInterval(function(){atomicOp.runOperations(1);},2500);
		//After an update has been installed, update the updater with new binaries.
		fs.rename("resources/app/newCSharpCode.SharpZipLib.dll","resources/app/ICSharpCode.SharpZipLib.dll",function(err : NodeJS.ErrnoException){});
		fs.rename("resources/app/newinstallUpdateProcess.exe","resources/app/installUpdateProcess.exe",function(err : NodeJS.ErrnoException){});

		fs.unlink("phat.update",function(err : NodeJS.ErrnoException){});
	}
);


app.on
(
	'will-quit',function() 
	{
			//dataMgr.setKey("application","operations",{});
			//console.log("cleared operations");
			//dataMgr.saveData();
			//console.log("saved data");
			//process.exit(0);
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
		winMgr.pushKeyTo(
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

		winMgr.publishChangeForKey(arg.channel,arg.key);
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

		else if(arg.opName == "renderSNPTrackForContig")
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
					"renderSNPTrackForContig",
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
			winMgr.closeAllExcept("projectSelection");
		}
		else if(arg.opName == "newProject")
		{
			atomicOp.addOperation("newProject",arg.name);
		}

		else if(arg.opName == "openProject")
		{
			let isCurrentlyLoaded = false;
			try
			{
				let rt = jsonFile.readFileSync("resources/app/rt/rt.json");

				if(rt)
				{
					if(rt.application)
					{
						if(rt.project)
						{
							//The project we're trying to load was the last one opened.
							//No need to unpack it again
							if(rt.project.uuid == arg.proj.uuid)
								isCurrentlyLoaded = true;
							else
								isCurrentlyLoaded = false;
						}
						else
							isCurrentlyLoaded = false;
					}
					else
						isCurrentlyLoaded = false;
				}
				else
					isCurrentlyLoaded = false;
			}
			catch(err){isCurrentlyLoaded = false;}

			if(isCurrentlyLoaded){
				console.log("last loaded same project");
				finishLoadingProject(arg.proj);
			}

			if(!isCurrentlyLoaded)
				atomicOp.addOperation("openProject",arg.proj);
		}
	}
);
atomicOp.updates.on(
	"indexFasta",function(op : atomicOp.AtomicOperation)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
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
			winMgr.publishChangeForKey("input","fastaInputs");
		}
	}
);
atomicOp.updates.on(
	"generateFastQCReport",function(op : atomicOp.AtomicOperation)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
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
			winMgr.publishChangeForKey("input","fastqInputs");
		}
	}
);
atomicOp.updates.on(
	"runAlignment",function(op : RunAlignment)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let aligns : Array<alignData> = dataMgr.getKey("align","aligns");
			if(aligns == undefined)
				aligns = new Array<alignData>();

			aligns.push(op.alignData);
			dataMgr.setKey("align","aligns",aligns);
			winMgr.publishChangeForKey("align","aligns");
		}
	}
);
atomicOp.updates.on(
	"renderCoverageTrackForContig",function(op : RenderCoverageTrackForContig)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures");
			for(let i = 0; i != circularFigures.length; ++i)
			{
				if(circularFigures[i].uuid == op.circularFigure.uuid)
				{
					circularFigures[i].renderedCoverageTracks.push(op.circularFigure.renderedCoverageTracks[op.circularFigure.renderedCoverageTracks.length - 1]);
					dataMgr.setKey("circularGenomeBuilder","circularFigures",circularFigures);
					winMgr.publishChangeForKey("circularGenomeBuilder","circularFigures");
					break;
				}
			}
		}
	}
);

atomicOp.updates.on(
	"renderSNPTrackForContig",function(op : RenderSNPTrackForContig)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures");
			for(let i = 0; i != circularFigures.length; ++i)
			{
				if(circularFigures[i].uuid == op.circularFigure.uuid)
				{
					circularFigures[i].renderedSNPTracks.push(op.circularFigure.renderedSNPTracks[op.circularFigure.renderedSNPTracks.length - 1]);
					dataMgr.setKey("circularGenomeBuilder","circularFigures",circularFigures);
					winMgr.publishChangeForKey("circularGenomeBuilder","circularFigures");
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
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			dataMgr.setKey("application","availableUpdate",op.extraData.asset);
		}
	}
);
atomicOp.updates.on(
	"downloadAndInstallUpdate",function(op : DownloadAndInstallUpdate)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			dataMgr.setKey("application","downloadedUpdate",true);
			//dataMgr.saveData();
			app.quit();
			//atomicOp.addOperation("saveCurrentProject",dataMgr.getKey("application","project"));
		}
	}
);

atomicOp.updates.on(
	"newProject",function(op : NewProject)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
	}
);

atomicOp.updates.on(
	"openProject",function(op : OpenProject)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.done && op.flags.success)
		{
			finishLoadingProject(op.proj);
		}
	}
);
atomicOp.updates.on(
	"saveCurrentProject",function(op : SaveCurrentProject)
	{
		if(op.flags.done)
		{
			if(op.flags.failure)
				throw new Error("There was an error saving your project");
			app.quit();
		}

	}
);