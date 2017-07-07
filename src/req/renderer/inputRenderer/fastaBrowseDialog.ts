import * as electron from "electron";
const dialog = electron.remote.dialog;
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
export function fastaBrowseDialog() : void
{
    dialog.showOpenDialog
	(
		{
			title : "Select Fasta Data",
			filters : 
			[
				{
					name : 'Fasta Data',
					extensions : 
					[
						'fasta',
						'fa'
					]
				}
			],
			properties  :
			[
				"openFile",
				"multiSelections"
			]
		},
		function(files : Array<string>)
		{
			//if files were selected
			if(files)
			{
				for(let i : number = 0; i != files.length; ++i)
				{
					ipc.send(
						"runOperation",
						<AtomicOperationIPC>{
							opName : "inputFastaFile",
							filePath : files[i]
						}
					);
                }
			}
		}
	);
}