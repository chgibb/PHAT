import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import * as viewMgr from "./req/renderer/viewMgr";
import * as masterView from "./req/renderer/NoSamHeaderPrompt/masterView";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";

$(function()
{

    masterView.addView(viewMgr.views,"view");
    viewMgr.changeView("masterView");
    ipc.send(
        "getKey",
        <GetKeyEvent>{
            channel : "input",
            key : "fastaInputs",
            replyChannel : "noSamHeaderPrompt",
            action : "getKey"
        }
    );
    ipc.send(
        "keySub",
        <KeySubEvent>{
            action : "keySub",
            channel : "input",
            key : "fastaInputs",
            replyChannel : "noSamHeaderPrompt"
        }
    );

    ipc.on("noSamHeaderPrompt",function(event : Electron.IpcMessageEvent,arg : any)
    {
        console.log(arg);
        if(arg.action == "getKey" || arg.action == "keyChange")
        {
            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
            if(arg.key == "fastaInputs" && arg.val !== undefined)
            {
                masterView.fastaInputs = arg.val;
            }
            if(arg.key == "inputBamFile" && arg.val !== undefined)
            {
                masterView.inputBamFile = arg.val;
            }
        }
        viewMgr.render();
    });
});