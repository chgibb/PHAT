var dialog = require('electron').remote.dialog;
module.exports = function(input)
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
		function(files)
		{
			//if files were selected
			if(files)
			{
				for(let i = 0; i != files.length; ++i)
				{
                	//create new items if not already existing
					if(!input.fastqExists(files[i]))
					{
                        input.addFastq(files[i]);
					}
                }
			}
		}
	);
}