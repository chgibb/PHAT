var fs = require('fs');
var id = require('./../MakeValidID.js');
module.exports = function(channel,arg,model)
{
	let name = "";
	if(process.platform == "linux")
		name = id.findOriginalInput(id.makeValidID(arg.args[0]),model.fastaInputs);
	else if(process.platform == "win32")
		name = id.findOriginalInput(id.makeValidID(arg.args[1]),model.fastaInputs);
    //haven't completed building yet.
	if(!arg.done)
	{
		for(let i = 0; i != model.fastaInputs.length; ++i)
	    {
		    if(model.fastaInputs[i].name == name)
			{
			    //update status
			    return;
			}
		}
	}
	if(arg.done)
	{
        if(arg.retCode != 0)
            alert(JSON.stringify(arg,undefined,4));
		for(let i = 0; i != model.fastaInputs.length; ++i)
		{
		    if(model.fastaInputs[i].name == name)
			{
				/*
				    bowtie may write either 32 bit(s) or 64 bit(l) indexes depending on the size of the input fasta.
					Which type to output is given by the following in bowtie2-build.py:

					delta               = 200
    				small_index_max_size= 4 * 1024**3 - delta

					which gives approximately 4294967096 bytes
				*/
				var fasta_size = model.fastaInputs[i].size; //the size of the current fasta in bits
				var size_threshold = 4294967096; //the size threshold between being 32-bit and being 64-bit
				var indexes_folder = "resources/app/rt/indexes/"; //the indexes folder url
				var x64 = (fasta_size > size_threshold ? "1" : ""); //if 64-bit, add a 1 to the file extension

				var sIndexes = 
				[
					model.fsAccess(indexes_folder+model.fastaInputs[i].alias+".1.bt2"+x64),
					model.fsAccess(indexes_folder+model.fastaInputs[i].alias+".2.bt2"+x64),
					model.fsAccess(indexes_folder+model.fastaInputs[i].alias+".3.bt2"+x64),
					model.fsAccess(indexes_folder+model.fastaInputs[i].alias+".4.bt2"+x64),
					model.fsAccess(indexes_folder+model.fastaInputs[i].alias+".rev.1.bt2"+x64),
					model.fsAccess(indexes_folder+model.fastaInputs[i].alias+".rev.2.bt2"+x64),
				];

				try
				{
					for(let k = 0; k != sIndexes.length; ++k)
					{
						fs.accessSync(sIndexes[k],fs.FS_OK | fs.R_OK);
					}
					//everything exist
					for(let k = 0; k != sIndexes.length; ++k)
					{
						model.fastaInputs[i].indexes.push(sIndexes[k]);
					}
					model.fastaInputs[i].indexed = true;
					model.fastaInputs[i].indexing = false;
					//ipc.send('input',{action : 'postState', key : 'fastaInputs', val : fastaInputs});
					model.postFastaInputs();
					return;
				}
				catch(err){throw new Error(err);}
			
				alert("Could Not Generate Index For "+model.fastaInputs[i].alias);
			}
		}
	}
}