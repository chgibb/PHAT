import * as electron from "electron";
const dialog = electron.remote.dialog;
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "../../../../atomicOperationsIPC";
import {enQueueOperation} from "../../../enQueueOperation";

let fastaExtensions = [
    "fasta",
    "fas",
    "fa",
    "seq",
    "fsa",
    "fna"
];

export function inputFastaDialog() : void
{
    dialog.showOpenDialog(
        {
            title : "Input Reference Sequences",
            filters : [
                {
                    name : "Reference Sequences",
                    extensions : fastaExtensions
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
                        opName : "inputFastaFile",
                        data : files[i]
                    });
                }
            }
        }
    );
}