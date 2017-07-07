import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import * as viewMgr from "./req/renderer/viewMgr";

import * as masterView from "./req/renderer/inputRenderer/masterView";
import * as fastqView from "./req/renderer/inputRenderer/FastqView";
import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

function postRender(view : viewMgr.View) : void
{
    let fastqView = $("#fastqView");
    fastqView.css("height",$(window).height()/2+"px");
    let fastaView = $("#fastaView");
    fastaView.css("height",$(window).height()/2+"px");
}
viewMgr.setPostRender(postRender);
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
        viewMgr.render();

        //on message from main process
        ipc.on
		(	
		    'input',function(event,arg)
			{
                //reply from call to getState
			    if(arg.action == "getKey" || arg.action == "keyChange")
				{
                    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                    let fastqView = <fastqView.View>viewMgr.getViewByName("fastqView",masterView.views);
					if(arg.key == 'fastqInputs')
					{
                        if(arg.val !== undefined)
                        {
                            fastqView.fastqInputs = arg.val;
                        }
                    }
                    if(arg.key == 'fastaInputs')
					{
                        if(arg.val !== undefined)
                        {
                            //input.fastaInputs = arg.val;
                        }
                    }
                }
                viewMgr.render();
            }
        );
        viewMgr.render();
    }
);
