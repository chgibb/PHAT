var fs = require('fs');

var canRead = require('./../canRead');
var faiParser = require('./../faiParser');

module.exports = function(channel,arg,model)
{
	
    /*if(arg.args[0] == "faidx")
	{
	    if(arg.done)
		{
		    var alias = "";
			for(var i in model.fastaInputs)
			{
		        if(model.fastaInputs[i].name == arg.extraData)
				{
					var fai = model.fsAccess("resources/app/rt/indexes/"+alias+".fai");
				    alias = model.fastaInputs[i].alias;
					model.fastaInputs[i].fai = fai;
					break;
				}
			}
			var src = model.fsAccess(arg.extraData+".fai");
			var dest = model.fsAccess("resources/app/rt/indexes/"+alias+".fai");
			//samtools' stdout is sometime delayed until after it has exited for some reason.
			//This will cause this function to trigger twice, resulting in a false failure.
			try
			{
				if(canRead(dest))
					return;
			}
			catch(err){}
			try
			{
				fs.renameSync(src,dest);
			}
			catch(err)
			{
				sleep(1);
				try
				{
					fs.renameSync(src,dest);
				}
				catch(err)
				{
					throw new Error("Could not copy fai index. Out of disk space.");
				}
			}
			model.fastaInputs[i].contigs = require('./FaiParser.js').getContigs(dest);
			console.log(JSON.stringify(model.fastaInputs[i].contigs,undefined,4));
			var bowTieIndex = model.fsAccess('resources/app/rt/indexes/'+model.fastaInputs[i].alias);
			model.spawnHandle
            (
			    'spawn',
                {
                    action : 'spawn',
                    replyChannel : 'input',
                    processName : model.bowTie2Build,
                    args : [model.fastaInputs[i].name,bowTieIndex],
                    unBuffer : true
                }
			);
		}
	}*/


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