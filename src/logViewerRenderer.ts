import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {streamLogToNode} from "./req/renderer/LogViewerRenderer/streamLogToNode";
import {LogRecord} from "./req/operations/atomicOperations";
require("./req/renderer/commonBehaviour");

ipc.on(
    "logViewer",
    function(event : Electron.IpcMessageEvent,arg : any){
        let logRecord : LogRecord = arg.logRecord;
        if(logRecord.status == "failure")
        {
            document.body.innerHTML = `
                <h4>This operation failed. Lines highlighted in red may point to the error</h4>
            `;
        }
        document.body.innerHTML += `
            <p>Log for: ${logRecord.name}</p>
            <p>${logRecord.status}</p>
            <p>${logRecord.runTime}ms</p>
            <p>${new Date(logRecord.startEpoch)}</p>
        `;
        streamLogToNode(logRecord,document.body);
    }
);