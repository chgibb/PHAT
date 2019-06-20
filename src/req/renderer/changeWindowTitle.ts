import * as electron from "electron";
const ipc = electron.ipcRenderer;
const webContents = electron.remote.webContents;

import {AtomicOperationIPC} from "./../atomicOperationsIPC";

export function changeWindowTitle(newTitle : string) : void
{
    ipc.send(
        "runOperation",
        <AtomicOperationIPC>{
            opName : "changeTitle",
            id : webContents.getFocusedWebContents().id,
            newTitle : newTitle
        }
    );
}