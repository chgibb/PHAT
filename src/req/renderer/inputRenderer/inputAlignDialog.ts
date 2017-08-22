import * as electron from "electron";
const dialog = electron.remote.dialog;
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";

export function inputAlignDialog() : void
{
    dialog.showOpenDialog(
        {
            title : "Input Alignment Maps",
            filters : [
                {
                    name : "Binary Alignment Maps",
                    extensions : ["bam"]
                }
            ],
            properties : [
                "openFile",
                "multiSelections"
            ]
        },
        function(files : Array<string>){
            if(files)
            {
                
            }
        }
    );
}