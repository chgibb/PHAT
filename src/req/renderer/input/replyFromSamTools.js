var fs = require('fs');

var canRead = require('./../canRead');
var faiParser = require('./../faiParser');

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
			var fai = model.fsAccess("resources/app/rt/indexes/"+model.fastaInputs[idx].alias+".fai");
			//samtools will place artifact in same dir as input file
			var src = model.fsAccess(arg.extraData+".fai");
			//samtools' stdout is sometimes delayed until after it has exited.
			//check to see if we've already moved the artifact and exit if so.
			try
			{
				if(canRead(fai))
					return
			}
			catch(err){}
			try
			{
				fs.renameSync(src,fai);
			}
			catch(err)
			{
				throw new Error("Could not copy fai index. Out of disk space.");
			}
			model.fastaInputs[idx].contigs = faiParser.getContigs(fai);
			var bowTieIndex = model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[idx].alias);
			model.fastaInputs[idx].fai = fai;
			model.spawnHandle
            (
			    'spawn',
                {
                    action : 'spawn',
                    replyChannel : 'input',
                    processName : model.bowTie2Build,
                    args : [model.fastaInputs[idx].name,bowTieIndex],
                    unBuffer : true
                }
			);
		}
	}
}