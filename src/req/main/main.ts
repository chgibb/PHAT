/**
 * The heart of PHAT. Any module should be able to require this module and have a fully functioning PHAT main process. This module should 
 * export nothing. It must be fully self contained.
 * This behaviour is expected from integration tests. Tests will require this module and then hook into events and inspect behaviour.
 * @module req/main/main
 */
import * as fs from "fs";
import * as electron from "electron";
const ipc = electron.ipcMain;
const app = electron.app;

if(require('electron-squirrel-startup')) app.quit();

import {getReadable,getWritable,getReadableAndWritable} from "./../getAppPath";
getReadable("");
getWritable("");
getReadableAndWritable("");

import {getEdition} from "./../getEdition";
import {appMenu} from "./appMenu";

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
import {OpenPileupViewer} from "./../operations/OpenPileupViewer";
import {OpenLogViewer} from "./../operations/OpenLogViewer";

import {InputFastqFile} from "./../operations/inputFastqFile";
import {InputFastaFile} from "./../operations/inputFastaFile";
import {ImportFileIntoProject} from "./../operations/ImportFileIntoProject";

import {CopyCircularFigure} from "./../operations/CopyCircularFigure";
import {DeleteCircularFigure} from "./../operations/DeleteCircularFigure";

import {CompileTemplates} from "./../operations/CompileTemplates";

import {ProjectManifest} from "./../projectManifest";

import {NewProject} from "./../operations/NewProject";
import {OpenProject} from "./../operations/OpenProject";
import {SaveCurrentProject} from "./../operations/SaveCurrentProject";
import {LoadCurrentlyOpenProject} from "./../operations/LoadCurrentlyOpenProject";

import * as winMgr from "./winMgr";

import {File,getPath} from "./../file";
import Fastq from "./../fastq";
import {Fasta} from "./../fasta";
import {alignData} from "./../alignData";
import {CircularFigure} from "./../renderer/circularFigure";

import {finishLoadingProject} from "./finishLoadingProject";

import {GetKeyEvent,SaveKeyEvent,KeySubEvent} from "./../ipcEvents";

var pjson = require('./package.json');


(<any>global).state = {};

require('./ProjectSelection');
require('./toolBar');
require('./Input');
require('./QC');
require('./Align');
require('./Output');
require('./Pileup');
require('./circularGenomeBuilder');
require('./OperationViewer');
require('./logViewer');


app.on
(
	'ready',function()
	{
		electron.Menu.setApplicationMenu(
			electron.Menu.buildFromTemplate(appMenu())
		);

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
		atomicOp.register("loadCurrentlyOpenProject",LoadCurrentlyOpenProject);

		atomicOp.register("openPileupViewer",OpenPileupViewer);
		atomicOp.register("openLogViewer",OpenLogViewer)
		atomicOp.register("inputFastqFile",InputFastqFile);
		atomicOp.register("inputFastaFile",InputFastaFile);
		atomicOp.register("importFileIntoProject",ImportFileIntoProject);
		atomicOp.register("copyCircularFigure",CopyCircularFigure);
		atomicOp.register("deleteCircularFigure",DeleteCircularFigure);
		atomicOp.register("compileTemplates",CompileTemplates);

		//on completion of any operation, wait and then broadcast the queue to listening windows
		atomicOp.setOnComplete(
			function(op : atomicOp.AtomicOperation){
				setTimeout(function(){
					setImmediate(function(){
						dataMgr.setKey("application","operations",atomicOp.operationsQueue);
						winMgr.publishChangeForKey("application","operations");
					});
				},500);
			}
		);

		setInterval(function(){atomicOp.runOperations(1);},100);
		//After an update has been installed, update the updater with new binaries.
		if(process.platform == "win32")
		{
			fs.rename(
				getReadableAndWritable("newCSharpCode.SharpZipLib.dll"),
				getReadableAndWritable("ICSharpCode.SharpZipLib.dll"),
				function(err : NodeJS.ErrnoException){}
			);
			fs.rename(
				getReadableAndWritable("newinstallUpdateProcess.exe"),
				getReadableAndWritable("installUpdateProcess.exe"),
				function(err : NodeJS.ErrnoException){}
			);
			fs.rename(
				getReadableAndWritable("newinstallUpdateNotificationWin32.exe"),
				getReadableAndWritable("installUpdateNotificationWin32.exe"),
				function(err : NodeJS.ErrnoException){}
			);
		}
		if(process.platform == "linux")
		{
			fs.rename(
				getReadableAndWritable("newinstallUpdateNotificationLinux"),
				getReadableAndWritable("installUpdateNotificationLinux"),
				function(err : NodeJS.ErrnoException){}
			);
			fs.rename(
				getReadableAndWritable("newinstallUpdateProcess"),
				getReadableAndWritable("installUpdateProcess"),
				function(err : NodeJS.ErrnoException){}
			);
			fs.rename(
				getReadableAndWritable("newinstallUpdateProcess.py"),
				getReadableAndWritable("installUpdateProcess.py"),
				function(err : NodeJS.ErrnoException){}
			);
		}
		fs.unlink("phat.update",function(err : NodeJS.ErrnoException){});
	}
);

ipc.on
(
	"openWindow",function(event : Electron.IpcMessageEvent,arg : {refName : string})
	{
		winMgr.windowCreators[arg.refName].Create();
	}
);
ipc.on
(
	"getKey",function(event : Electron.IpcMessageEvent,arg : GetKeyEvent)
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
	"saveKey",function(event : Electron.IpcMessageEvent,arg : SaveKeyEvent)
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
	"keySub",function(event : Electron.IpcMessageEvent,arg : KeySubEvent)
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
	"runOperation",function(event : Electron.IpcMessageEvent,arg : AtomicOperationIPC)
	{
		console.log(arg);
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(arg.opName =="indexFasta" || arg.opName == "generateFastQCReport")
		{
			let list : Array<File> = dataMgr.getKey(arg.channel,arg.key);
			for(let i : number = 0; i != list.length; ++i)
			{
				if(list[i].uuid == arg.uuid)
				{
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

			//If we're running a portable edition then we can use our auto updater
			let isPortable = /(portable)/i;
			if(isPortable.test(getEdition()))
			{
				if(!asset)
					return;
				atomicOp.addOperation("downloadAndInstallUpdate",
				{
					asset : asset,
					token : token
				});
				winMgr.closeAllExcept("projectSelection");
			}
			else
			{
				//Electron.shell.openExternal("https://github.com/chgibb/PHAT/releases");
			}
		}
		else if(arg.opName == "newProject")
		{
			atomicOp.addOperation("newProject",arg.name);
		}

		else if(arg.opName == "openProject")
		{
			atomicOp.addOperation("openProject",{
				proj : arg.proj,
				externalProjectPath : arg.externalProjectPath
			});
		}
		else if(arg.opName == "loadCurrentlyOpenProject")
		{
			atomicOp.addOperation("loadCurrentlyOpenProject",{});
		}
		else if(arg.opName == "openPileupViewer")
		{
			atomicOp.addOperation("openPileupViewer",arg.pileupViewerParams);
		}
		else if(arg.opName == "openLogViewer")
		{
			atomicOp.addOperation("openLogViewer",arg.logRecord);
		}
		else if(arg.opName == "inputFastqFile")
		{
			let fastqs : Array<Fastq> = dataMgr.getKey("input","fastqInputs");
			if(fastqs)
			{
				for(let i = 0; i != fastqs.length; ++i)
				{
					if(getPath(fastqs[i]) == arg.filePath)
					{
						return;
					}
				}
			}
			atomicOp.addOperation("inputFastqFile",arg.filePath);
		}
		else if(arg.opName == "inputFastaFile")
		{
			let fastas : Array<Fasta> = dataMgr.getKey("input","fastaInputs");
			if(fastas)
			{
				for(let i = 0; i != fastas.length; ++i)
				{
					if(getPath(fastas[i]) == arg.filePath)
					{
						return;
					}
				}
			}
			atomicOp.addOperation("inputFastaFile",arg.filePath);
		}
		else if(arg.opName == "importFileIntoProject")
		{
			let fastqInputs : Array<Fastq> = dataMgr.getKey("input","fastqInputs");
			if(fastqInputs)
			{
				for(let i = 0; i != fastqInputs.length; ++i)
				{
					if(fastqInputs[i].uuid == arg.uuid)
					{
						if(fastqInputs[i].imported)
							return;
						let tmp = {};
						Object.assign(tmp,fastqInputs[i]);
						atomicOp.addOperation(arg.opName,tmp);
						return;
					}
				}
			}
			let fastaInputs : Array<Fasta> = dataMgr.getKey("input","fastaInputs");
			if(fastaInputs)
			{
				for(let i = 0; i != fastaInputs.length; ++i)
				{
					if(fastaInputs[i].uuid == arg.uuid)
					{
						if(fastaInputs[i].imported)
							return;
						let tmp = {};
						Object.assign(tmp,fastaInputs[i]);
						atomicOp.addOperation(arg.opName,tmp);
						return;
					}
				}
			}
		}
		else if(arg.opName == "copyCircularFigure")
		{
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures");
			if(circularFigures)
			{
				let circularFigure : CircularFigure = <any>{};
				for(let i = 0; i != circularFigures.length; ++i)
				{
					if(arg.figureuuid == circularFigures[i].uuid)
					{
						Object.assign(circularFigure,circularFigures[i]);
						break;
					}
				}
				atomicOp.addOperation("copyCircularFigure",circularFigure);
			}
		}
		else if(arg.opName == "deleteCircularFigure")
		{
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures");
			if(circularFigures)
			{
				let circularFigure : CircularFigure = <any>{};
				for(let i = 0; i != circularFigures.length; ++i)
				{
					if(arg.figureuuid == circularFigures[i].uuid)
					{
						Object.assign(circularFigure,circularFigures[i]);
						break;
					}
				}
				atomicOp.addOperation("deleteCircularFigure",circularFigure);
			}
		}
		else if(arg.opName == "compileTemplates")
		{
			for(let i = 0; i != atomicOp.operationsQueue.length; ++i)
			{
				if(atomicOp.operationsQueue[i].name == "compileTemplates")
				{
					if((<CompileTemplates>atomicOp.operationsQueue[i]).uuid && arg.uuid && (<CompileTemplates>atomicOp.operationsQueue[i]).uuid == arg.uuid)
					{
						return;
					}
				}
			}
			atomicOp.addOperation("compileTemplates",{
				figure : arg.figure,
				uuid : arg.uuid,
				compileBase : arg.compileBase
			});
		}
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
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
	"inputFastqFile",function(op : InputFastqFile)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let fastqs : Array<Fastq> = dataMgr.getKey("input","fastqInputs");
			if(!fastqs)
				fastqs = new Array<Fastq>();
			fastqs.push(op.fastq);
			dataMgr.setKey("input","fastqInputs",fastqs);
			winMgr.publishChangeForKey("input","fastqInputs");
		}
	}
);

atomicOp.updates.on(
	"inputFastaFile",function(op : InputFastaFile)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let fastas : Array<Fasta> = dataMgr.getKey("input","fastaInputs");
			if(!fastas)
				fastas = new Array<Fasta>();
			fastas.push(op.fasta);
			dataMgr.setKey("input","fastaInputs",fastas);
			winMgr.publishChangeForKey("input","fastaInputs");
		}
	}
);

atomicOp.updates.on(
	"importFileIntoProject",function(op : ImportFileIntoProject)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let fastqInputs : Array<Fastq> = dataMgr.getKey("input","fastqInputs");
			if(fastqInputs)
			{
				for(let i = 0; i != fastqInputs.length; ++i)
				{
					if(fastqInputs[i].uuid == op.file.uuid)
					{
						fastqInputs[i] = <Fastq>op.file;
						dataMgr.setKey("input","fastqInputs",fastqInputs);
						winMgr.publishChangeForKey("input","fastqInputs");
						return;
					}
				}
			}
			let fastaInputs : Array<Fasta> = dataMgr.getKey("input","fastaInputs");
			if(fastaInputs)
			{
				for(let i = 0; i != fastaInputs.length; ++i)
				{
					if(fastaInputs[i].uuid == op.file.uuid)
					{
						fastaInputs[i] = <Fasta>op.file;
						dataMgr.setKey("input","fastaInputs",fastaInputs);
						winMgr.publishChangeForKey("input","fastaInputs");
						return;
					}
				}
			}
		}
	}
);

atomicOp.updates.on(
	"copyCircularFigure",function(op : CopyCircularFigure)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures");
			circularFigures.push(op.newFigure);
			dataMgr.setKey("circularGenomeBuilder","circularFigures",circularFigures);
			winMgr.publishChangeForKey("circularGenomeBuilder","circularFigures");
		}
	}
);

atomicOp.updates.on(
	"deleteCircularFigure",function(op : DeleteCircularFigure)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.success)
		{
			let circularFigures : Array<CircularFigure> = dataMgr.getKey("circularGenomeBuilder","circularFigures");
			for(let i = circularFigures.length - 1; i != -1; i--)
			{
				if(circularFigures[i].uuid == op.figure.uuid)
				{
					circularFigures.splice(i,1);
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
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
		if(op.flags.done)
		{
			if(op.flags.failure)
				throw new Error("There was an error saving your project");
			dataMgr.setKey("application","finishedSavingProject",true);
			app.quit();
		}

	}
);

atomicOp.updates.on(
	"loadCurrentlyOpenProject",function(op : LoadCurrentlyOpenProject)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
	}
);

atomicOp.updates.on(
	"compileTemplates",function(op : CompileTemplates)
	{
		dataMgr.setKey("application","operations",atomicOp.operationsQueue);
		winMgr.publishChangeForKey("application","operations");
	}
);