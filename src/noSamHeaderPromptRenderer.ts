import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import * as viewMgr from "./req/renderer/viewMgr";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";

$(function(){
    ipc.send(
        "getKey",
        <GetKeyEvent>{
            channel : "input",
            key : "fastaInputs",
            replyChannel : "noSamHeaderPrompt",
            action : "getKey"
        }
    );

    ipc.on("noSamHeaderPrompt",function(event : Electron.IpcMessageEvent,arg : any){
        if(arg.action == "getKey" || arg.action == "keyChange")
        {
        }
    });
});