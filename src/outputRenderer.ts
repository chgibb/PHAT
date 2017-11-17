import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import * as viewMgr from "./req/renderer/viewMgr";

import * as masterView from "./req/renderer/OutputRenderer/masterView";

const $ = require("jquery");
(<any>window).$ = $;
import "./req/renderer/commonBehaviour";
$
(
    function()
    {
        masterView.addView(viewMgr.views,"masterView");
        viewMgr.changeView("masterView");


        viewMgr.render();
        ipc.on
        (
            "output",function(event : Electron.IpcMessageEvent,arg : any)
            {
                if(arg.action === "getKey" || arg.action === "keyChange")
                {
                     let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                     if(arg.key == "fastqInputs" && arg.val !== undefined)
                     {
                         masterView.fastqInputs = arg.val;
                     }
                     if(arg.key == "fastaInputs" && arg.val !== undefined)
                     {
                        masterView.fastaInputs = arg.val;
                     }
                     if(arg.key == "aligns" && arg.val !== undefined)
                     {
                        masterView.alignData = arg.val;
                     }
                }
                viewMgr.render();
            }
        );

        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            }
        );

        ipc.send(
            "getKey",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            }
        );

        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "output"
            }
        );

        ipc.send(
            "getKey",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "output"
            }
        );

        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "align",
                key : "aligns",
                replyChannel : "output"
            }
        );

        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "align",
                key : "aligns",
                replyChannel : "output"
            }
        );

        viewMgr.render();
    }
);