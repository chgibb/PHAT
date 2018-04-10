import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import * as viewMgr from "./req/renderer/viewMgr";
import {makeWindowDockable} from "./req/renderer/dock";

import * as masterView from "./req/renderer/inputRenderer/masterView";
import * as fastqView from "./req/renderer/inputRenderer/FastqView";
import * as fastaView from "./req/renderer/inputRenderer/FastaView";

import {AtomicOperation} from "./req/operations/atomicOperations";
import {IndexFastaForAlignment} from "./req/operations/indexFastaForAlignment";
import {IndexFastaForVisualization} from "./req/operations/indexFastaForVisualization";
import {InputBamFile} from "./req/operations/InputBamFile";
import {LinkRefSeqToAlignment} from "./req/operations/LinkRefSeqToAlignment";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";

function postRender(view : viewMgr.View) : void
{
    let fastqView = $("#fastqView");
    if(fastqView)
        fastqView.css("height",$(window).height()/2+"px");
    let fastaView = $("#fastaView");
    if(fastaView)
        fastaView.css("height",$(window).height()/2+"px");
}
$(window).resize
(
	function()
	{
        viewMgr.render();
    }
);
$
(
    function()
    {
        makeWindowDockable("input");
        viewMgr.setPostRender(postRender);
        masterView.addView(viewMgr.views,'view');

        viewMgr.changeView("masterView");

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
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "align",
                key : "aligns",
                replyChannel : "input",
                action : "getKey"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "application",
                key : "operations",
                replyChannel : "input"
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
        ipc.send(
            "keySub",
            <KeySubEvent>{
                channel : "align",
                key : "aligns",
                replyChannel : "input",
                action : "keySub"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "input"
            }
        );

        viewMgr.render();

        //on message from main process
        ipc.on
		(	
		    'input',function(event : Electron.IpcMessageEvent,arg : any)
			{
                //reply from call to getState
			    if(arg.action == "getKey" || arg.action == "keyChange")
				{
                    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
					if(arg.key == 'fastqInputs')
					{
                        if(arg.val !== undefined)
                        {
                            masterView.fastqInputs = arg.val;
                        }
                    }
                    if(arg.key == 'fastaInputs')
					{
                        if(arg.val !== undefined)
                        {
                            masterView.fastaInputs = arg.val;
                        }
                    }
                    if(arg.key == 'aligns')
                    {
                        if(arg.val !== undefined)
                        {
                            masterView.aligns = arg.val;
                        }
                    }
                    let found = false;
                    if(arg.key == "operations")
                    {
                        if(arg.val !== undefined)
                        {
                            let ops : Array<AtomicOperation> = arg.val;
                            //occasionally when docking, we can recieve the deleted window docking operation
                            try
                            {
                                for(let i = 0; i != ops.length; ++i)
                                {
                                    if(ops[i].name == "inputBamFile" || ops[i].name == "linkRefSeqToAlignment" ||
                                    ops[i].name == "indexFastaForVisualization" || ops[i].name == "indexFastaForAlignment" ||
                                    ops[i].name == "linkRefSeqToAlignment" || ops[i].name == "importFileIntoProject")
                                    {
                                        masterView.shouldAllowTriggeringOps = false;
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            catch(err){}
                        }
                    }
                    if(!found)
                        masterView.shouldAllowTriggeringOps = true;
                    setTimeout(function(){
                        masterView.dataChanged();
                        viewMgr.render();
                    },100);
                }
                viewMgr.render();

            }
        );
        viewMgr.render();
        window.dispatchEvent(new Event("resize"));
    }
);