import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./req/renderer/viewMgr";
import {GetKeyEvent} from "./req/ipcEvents";

import {getPIDInfo,PIDInfo} from "./req/pidInfo";

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
            "procMgr",async function(event : Electron.IpcMessageEvent,arg : any)
            {
                if(arg.key == "pids")
                {
                    let info = new Array<PIDInfo>();
                    for(let i = 0; i != arg.val.length; ++i)
                    {
                        info = info.concat(await getPIDInfo(arg.val[i]));
                    }
                    console.log(info);
                }
            }
        );
    }
);