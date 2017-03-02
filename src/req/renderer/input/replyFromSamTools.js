let fse = require('fs-extra');
var fs = require('fs');

var canRead = require('./../canRead');
var faiParser = require('./../faiParser');
var fsAccess = require("./../../fsAccess");
var sleep = require("./../../sleep");

module.exports = function(channel,arg,model)
{
	if(arg.args[0] == "faidx")
	{
		if(arg.done)
		{
			var idx = -1;
			for(let i = 0; i != model.fastaInputs.length; ++i)
			{
				if(model.fastaInputs[i].name == arg.extraData)
				{
					idx = i;
					break;
				}
			}
			if(idx == -1)
				throw new Error("Can not create faidx index for fasta which does not exist!");
				
			let fai = fsAccess("resources/app/rt/indexes/"+model.fastaInputs[idx].alias+".fai",false);
			//samtools will place artifact in same dir as input file
			let src = model.fsAccess(arg.extraData+".fai");

			fse.move
			(
				src,fai,{overwrite : true},function(err)
				{
					if(err)
					{
						model.fastaInputs[idx].indexing = false;
						throw new Error(err);
					}
					model.fastaInputs[idx].contigs = faiParser.getContigs(fai);
					var bowTieIndex = fsAccess('resources/app/rt/indexes/'+model.fastaInputs[idx].alias,false);
					model.fastaInputs[idx].fai = fai;
					let args = [];
					if(process.platform == "linux")
						args = [model.fastaInputs[idx].name,bowTieIndex];
					else if(process.platform == "win32")
						args = [model.fsAccess("resources/app/bowtie2-build"), model.fastaInputs[idx].name,bowTieIndex]
					model.spawnHandle
            		(
			    		'spawn',
                		{
                    		action : 'spawn',
                    		replyChannel : 'input',
                    		processName : model.bowTie2Build,
                    		args : args,
                    		unBuffer : true
                		}
					);
				}
			);
		}
	}
}