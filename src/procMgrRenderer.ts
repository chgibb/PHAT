import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./req/renderer/viewMgr";
import {GetKeyEvent} from "./req/ipcEvents";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

let pingPIDs : NodeJS.Timer = setInterval(function(){
    ipc.send(
        "getAllPIDs",
        <GetKeyEvent>{
            action : "getKey",
            replyChannel : "procMgr"
        }
    );
},1000);

$
(
    function()
    {
        ipc.on
        (
            "procMgr",function(event : Electron.IpcMessageEvent,arg : any)
            {
                console.log(arg);
            }
        );
    }
);