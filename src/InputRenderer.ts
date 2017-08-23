import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import * as viewMgr from "./req/renderer/viewMgr";

import * as masterView from "./req/renderer/inputRenderer/masterView";
import * as fastqView from "./req/renderer/inputRenderer/FastqView";
import * as fastaView from "./req/renderer/inputRenderer/FastaView";
import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

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
                    masterView.dataChanged();
                }
                viewMgr.render();

            }
        );
        viewMgr.render();
        window.dispatchEvent(new Event("resize"));
    }
);
