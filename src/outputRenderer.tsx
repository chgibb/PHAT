import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import {makeWindowDockable} from "./req/renderer/dock";

import "./req/renderer/styles/defaults";
import "./req/renderer/commonBehaviour";
import { OutputRendererApp } from './req/renderer/OutputRenderer/app';

render(
    <OutputRendererApp />,
    document.getElementById("app")
);

        makeWindowDockable("output");
        /*ipc.on(
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
*/
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            } as KeySubEvent
        );

        ipc.send(
            "getKey",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            } as KeySubEvent
        );

        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "output"
            } as KeySubEvent
        );

        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "output"
            } as GetKeyEvent
        );

        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "align",
                key : "aligns",
                replyChannel : "output"
            } as GetKeyEvent
        );

        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "align",
                key : "aligns",
                replyChannel : "output"
            } as KeySubEvent
        );