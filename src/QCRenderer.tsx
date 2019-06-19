import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as React from "react";
import { render } from "react-dom";

import { makeWindowDockable } from "./req/renderer/dock";

import "./req/renderer/commonBehaviour";
import "./req/renderer/styles/defaults";
import { QCRendererApp } from './req/renderer/QCRenderer/app';
import { KeySubEvent, GetKeyEvent } from './req/ipcEvents';

render(
    <QCRendererApp />,
    document.getElementById("app")
);

makeWindowDockable("QC");

ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "QC"
    } as KeySubEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "application",
        key: "operations",
        replyChannel: "QC"
    } as GetKeyEvent
);
ipc.send(
    "getKey",
    {
        action: "getKey",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "QC"
    } as GetKeyEvent
);
ipc.send(
    "keySub",
    {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "QC"
    }
);
