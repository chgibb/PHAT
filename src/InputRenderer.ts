import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import * as viewMgr from "./req/renderer/viewMgr";

import * as masterView from "./req/renderer/inputRenderer/masterView";
import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

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
					if(arg.key == 'fastqInputs')
					{
                        if(arg.val !== undefined)
                        {
                            //input.fastqInputs = arg.val;
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
