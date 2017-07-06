import * as electron from "electron";
const dialog = electron.remote.dialog;
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
export function fastqBrowseDialog() : void
{
	dialog.showOpenDialog
	(
		{
			title : "Select Fastq Data",
			filters : 
			[
				{
					name : 'FastQ Data',
					extensions : 
					[
						'fastq',
						'fq'
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
			//if files were selected
			/*if(files)
			{
				for(let i : number = 0; i != files.length; ++i)
				{
                	//create new items if not already existing
					if(!input.fastqExists(files[i]))
					{
                        input.addFastq(files[i]);
					}
                }
				input.postFastqInputs();
			}*/
		}
	);
}