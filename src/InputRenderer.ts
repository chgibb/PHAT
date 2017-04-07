import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import {makeValidID} from "./req/renderer/MakeValidID";
import * as viewMgr from "./req/renderer/viewMgr";
let debug = require("./req/renderer/sendDebugMessage");
debug.initialize("input");

import * as fastaView from "./req/renderer/inputRenderer/FastaView";
import * as fastqView from "./req/renderer/inputRenderer/FastqView";

import showFastaBrowseDialog from "./req/renderer/inputRenderer/fastaBrowseDialog";
import showFastqBrowseDialog from "./req/renderer/inputRenderer/fastqBrowseDialog";
import Input from "./req/renderer/Input";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");
var input = new Input
(
    //state channel to operate on
    "input",
    {
        //on attempt to save state
        postStateHandle : function(channel,arg)
        {
            //forward message to main process
            ipc.send(channel,arg);
            //rerender window with updated data
            viewMgr.render();
        },
        //on attempt to spawn a process
        spawnHandle : function(channel,arg)
        {
            //forward message to main process
            ipc.send(channel,arg);
        },
        //On any attempt to access a file system resource.
        //Includes attempts to spawn other processes.
        //This function will be called first with the path to the process
        //to spawn before spawnHandle is invoked.
        //Default paths given assume running under PHAT. If running headless/CLI
        //or if a different directory structure is required then this function can be 
        //used to make necessary changes.
        fsAccess : function(str)
        {
            return str;
        }
    }
);

function preRender(viewRef : viewMgr.View)
{
    if(viewMgr.currView == 'fastq')
    {
        (<HTMLImageElement>document.getElementById('fastqButton')).src = 'img/fastqButtonActive.png';
        (<HTMLImageElement>document.getElementById('refSeqButton')).src = 'img/refSeqButton.png';
    }
    else if(viewMgr.currView == 'fasta')
    {
        (<HTMLImageElement>document.getElementById('fastqButton')).src = 'img/fastqButton.png';
        (<HTMLImageElement>document.getElementById('refSeqButton')).src = 'img/refSeqButtonActive.png';
    }
}
viewMgr.setPreRender(preRender);
$
(
    function()
    {
        fastaView.addView(viewMgr.views,'loadedFiles',input);
        fastqView.addView(viewMgr.views,'loadedFiles',input);

        viewMgr.changeView("fastq");

        //get saved data
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "input",
                key : "fastqInputs",
                replyChannel : "input",
                action : "getKey"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "input",
                key : "fastaInputs",
                replyChannel : "input",
                action : "getKey"
            }
        );

        //subscribe to changes in data
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "input"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "input"
            }
        );

        //on message from main process
        ipc.on
		(	
		    'input',function(event,arg)
			{
                //reply from call to getState
			    if(arg.action == "getKey" || arg.action == "keyChange")
				{
					if(arg.key == 'fastqInputs')
					{
                        if(arg.val !== undefined)
                        {
                            input.fastqInputs = arg.val;
                        }
                    }
                    if(arg.key == 'fastaInputs')
					{
                        if(arg.val !== undefined)
                        {
                            input.fastaInputs = arg.val;
                        }
                    }
                }
                viewMgr.render();
            }
        );
        ipc.on
        (
            "spawnReply",function(event,arg)
            {
                //update from spawned process.
                //forward to handler.
                input.spawnReply("spawnReply",arg);
            }
        );
        document.getElementById("fastqButton").onclick = function()
        {
            viewMgr.changeView("fastq");
        }
        document.getElementById("refSeqButton").onclick = function()
        {
            viewMgr.changeView("fasta");
        }
        document.getElementById("browseButton").onclick = function()
        {
            browse();
        }
        viewMgr.render();
    }
);
function browse()
{
    if(viewMgr.currView == 'fastq')
        showFastqBrowseDialog(input);
    if(viewMgr.currView == 'fasta')
        showFastaBrowseDialog(input);
}

