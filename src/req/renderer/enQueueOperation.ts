import * as electron from "electron";

import {AddOperationType} from "../operations/atomicOperations";
const ipc = electron.ipcRenderer;

export function enQueueOperation(operation : AddOperationType) : void
{
    ipc.send("runOperation",operation);
}
