import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";

import {InputRendererApp} from "./req/renderer/inputRenderer/app";
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import {makeWindowDockable} from "./req/renderer/dock";

import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";

render(
    <InputRendererApp />,
    document.getElementById("app")
);

//window.onload = function(){
makeWindowDockable("input");
//get saved data
ipc.send(
    "getKey",
        {
            channel : "input",
            key : "fastqInputs",
            replyChannel : "input",
            action : "getKey"
        } as GetKeyEvent
);
ipc.send(
    "getKey",
        {
            channel : "input",
            key : "fastaInputs",
            replyChannel : "input",
            action : "getKey"
        }  as GetKeyEvent
);
ipc.send(
    "getKey",
        {
            channel : "align",
            key : "aligns",
            replyChannel : "input",
            action : "getKey"
        }  as GetKeyEvent
);
ipc.send(
    "getKey",
        {
            action : "getKey",
            channel : "application",
            key : "operations",
            replyChannel : "input"
        }  as GetKeyEvent
);

//subscribe to changes in data
ipc.send(
    "keySub",
        {
            action : "keySub",
            channel : "input",
            key : "fastqInputs",
            replyChannel : "input"
        } as KeySubEvent
);
ipc.send(
    "keySub",
        {
            action : "keySub",
            channel : "input",
            key : "fastaInputs",
            replyChannel : "input"
        } as KeySubEvent
);
ipc.send(
    "keySub",
        {
            channel : "align",
            key : "aligns",
            replyChannel : "input",
            action : "keySub"
        } as KeySubEvent
);
ipc.send(
    "keySub",
        {
            action : "keySub",
            channel : "application",
            key : "operations",
            replyChannel : "input"
        } as KeySubEvent
);
//}

