import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {getReadableAndWritable} from "./req/getAppPath";
import {LogRecord} from "./req/operations/atomicOperations";
require("./req/renderer/commonBehaviour");

ipc.on(
    "logViewer",
    function(event,arg){
        let logRecord : LogRecord = arg.logRecord;
        document.body.innerHTML = `
            <p>Log for: ${logRecord.name}</p>
            <p>${logRecord.status}</p>
            <p>${logRecord.runTime}ms</p>
            <p>${new Date(logRecord.startEpoch)}</p>
            <pre>${
                (<any>fs.readFileSync(
                    getReadableAndWritable(`logs/${logRecord.uuid}/log`)
                ).toString())
            }</pre>
        `;
    }
);