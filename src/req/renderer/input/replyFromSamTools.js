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
			var fai = fsAccess("resources/app/rt/indexes/"+model.fastaInputs[idx].alias+".fai",false);
			//samtools will place artifact in same dir as input file
			var src = model.fsAccess(arg.extraData+".fai");
			//samtools' stdout is sometimes delayed until after it has exited.
			//check to see if we've already moved the artifact and exit if so.
			try
			{
				if(canRead(fai))
					return;
			}
			catch(err){}
			try
			{
				fs.renameSync(src,fai);
			}
			catch(err)
			{ 
                //Potential issue with disk I/O. Wait a second and try again.
                sleep(1);
                try
                {
                    fs.renameSync(src,fai);
                }
                //Probably not an issue with disk I/O. Reset the indexing state of the item and print an error.
                catch(err)
                {
                    model.fastaInputs[idx].indexing = false;
                    alert(err);
				    throw new Error(`Could not move "${src}" to "${fai}"`);
                }
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
                    args : arg,
                    unBuffer : true
                }
			);
		}
	}
}