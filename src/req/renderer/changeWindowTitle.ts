import * as electron from "electron";
const ipc = electron.ipcRenderer;
const webContents = electron.remote.webContents;

import {enQueueOperation} from "./enQueueOperation";

export function changeWindowTitle(newTitle : string) : void
{
    enQueueOperation({opName : "changeTitle",
        id : webContents.getFocusedWebContents().id,
        newTitle : newTitle});
}