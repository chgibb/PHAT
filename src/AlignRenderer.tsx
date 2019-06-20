import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import {render} from "react-dom";

import {GetKeyEvent, KeySubEvent} from "./req/ipcEvents";
import {makeWindowDockable} from "./req/renderer/dock";
import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import {AlignRendererApp} from "./req/renderer/AlignRenderer/app";

render(
    <AlignRendererApp />,
    document.getElementById("app")
);

makeWindowDockable("align");

ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "align"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "align"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "application",
        key: "operations",
        replyChannel: "align"
    } as GetKeyEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "align"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "align"
    } as KeySubEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "align"
    } as KeySubEvent
);