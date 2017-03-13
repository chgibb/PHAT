import * as electron from "electron";
const dialog = electron.remote.dialog;

import Input from "./../Input";
export default function showFastqBrowseDialog(input : Input) : void
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
			//if files were selected
			if(files)
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
			}
		}
	);
}