import * as electron from "electron";
const dialog = electron.remote.dialog;
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "../../../../atomicOperationsIPC";
import {enQueueOperation} from "../../../enQueueOperation";

export function inputAlignDialog() : void
{
    dialog.showOpenDialog(
        {
            title : "Input Alignment Maps",
            filters : [
                {
                    name : "Binary Alignment Maps",
                    extensions : ["bam","sam"]
                }
            ],
            properties : [
                "openFile",
                "multiSelections"
            ]
        },
        function(files : Array<string>)
        {
            if(files)
            {
                for(let i = 0; i != files.length; ++i)
                {
                    enQueueOperation({
                        opName : "inputBamFile",
                        bamPath : files[i]
                    });
                }
            }
        }
    );
}