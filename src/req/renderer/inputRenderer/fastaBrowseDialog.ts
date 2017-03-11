import * as electron from "electron";
const dialog = electron.remote.dialog;

import Input from "./../Input";
export default function showFastaBrowseDialog(input : Input) : void
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
                	//create new items if not already existing
					if(!input.fastaExists(files[i]))
					{
                    	input.addFasta(files[i]);
					}
                }
				input.postFastaInputs();
			}
		}
	);
}