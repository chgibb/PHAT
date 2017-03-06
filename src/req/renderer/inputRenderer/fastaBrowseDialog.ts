module.exports = function(input)
{
	var dialog = require('electron').remote.dialog;
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
		function(files)
		{
			//if files were selected
			if(files)
			{
				for(let i = 0; i != files.length; ++i)
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