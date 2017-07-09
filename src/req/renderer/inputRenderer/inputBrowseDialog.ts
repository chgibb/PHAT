import * as electron from "electron";
const dialog = electron.remote.dialog;
const ipc = electron.ipcRenderer;

import * as path from "path";

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";

let fastqExtensions = [
    "fastq",
    "fq"
];
let fastaExtensions = [
    "fasta",
    "fa"
]

export function inputBrowseDialog() : void
{
    dialog.showOpenDialog(
        {
            title : "Select Files",
            filters : [
                {
                    name : "Read File",
                    extensions : fastqExtensions
                },
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
        function(files : Array<string>){
            if(files)
            {
                for(let i = 0; i != files.length; ++i)
                {
                    for(let j = 0; j != fastqExtensions.length; ++j)
                    {
                        if(path.extname(files[i]) == `.${fastqExtensions[j]}`)
                        {
                            ipc.send(
						        "runOperation",
						        <AtomicOperationIPC>{
							        opName : "inputFastqFile",
							        filePath : files[i]
						        }
					        );
                            break;
                        }
                    }
                    for(let j = 0; j != fastaExtensions.length; ++j)
                    {
                        if(path.extname(files[i]) == `.${fastaExtensions[j]}`)
                        {
                            ipc.send(
						        "runOperation",
						        <AtomicOperationIPC>{
							        opName : "inputFastaFile",
							        filePath : files[i]
						        }
					        );
                            break;
                        }
                    }
                }
            }
        }

    );
}