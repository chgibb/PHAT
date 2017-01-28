var fs = require('fs');
var id = require('./../MakeValidID.js');
module.exports = function(channel,arg,model)
{
    //haven't completed building yet.
	if(!arg.done)
	{
	    var name = id.findOriginalInput(id.makeValidID(arg.args[0]),model.fastaInputs);
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
	    var name = id.findOriginalInput(id.makeValidID(arg.args[0]),model.fastaInputs);
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
				var size_of = model.fastaInputs[i].size;
				var size_threshold = 4294967096;

				var sIndexes = 
				[
					model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[i].alias+".1.bt2"+(size_of > size_threshold ? "1" : "")),
					model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[i].alias+".2.bt2"+(size_of > size_threshold ? "1" : "")),
					model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[i].alias+".3.bt2"+(size_of > size_threshold ? "1" : "")),
					model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[i].alias+".4.bt2"+(size_of > size_threshold ? "1" : "")),
					model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[i].alias+".rev.1.bt2"+(size_of > size_threshold ? "1" : "")),
					model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[i].alias+".rev.2.bt2"+(size_of > size_threshold ? "1" : "")),
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
				catch(err){console.log(err);}
			
				alert("Could Not Generate Index For "+model.fastaInputs[i].alias);
			}
		}
	}
}