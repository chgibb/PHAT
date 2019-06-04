import * as electron from "electron";
const dialog = electron.remote.dialog;
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";

let fastqExtensions = [
    "fastq",
    "fq"
];

export function inputFastqDialog() : void
{
    dialog.showOpenDialog(
        {
            title : "Input Read Files",
            filters : [
                {
                    name : "Read Files",
                    extensions : fastqExtensions
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
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "inputFastqFile",
                            filePath : files[i]
                        }
                    );
                }
            }
        }
    );
}