import * as fs from "fs";
import {makeValidID,findOriginalInput} from "./../MakeValidID";
import {SpawnRequestParams} from "./../../JobIPC";
import Input from "./../Input";
export default function replyFromBowTie2Build(channel : string,arg : SpawnRequestParams,model : Input) : void
{
	let name : string = "";
	if(process.platform == "linux")
		name = findOriginalInput(makeValidID(arg.args[0]),model.fastaInputs);
	else if(process.platform == "win32")
		name = findOriginalInput(makeValidID(arg.args[1]),model.fastaInputs);
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
	setTimeout
	(
		function()
		{
			if(arg.done && arg.retCode !== undefined)
			{
        		if(arg.retCode !== undefined && arg.retCode != 0)
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
						let fasta_size : number = model.fastaInputs[i].size; //the size of the current fasta in bits
						let size_threshold : number = 4294967096; //the size threshold between being 32-bit and being 64-bit
						let indexes_folder : string = "resources/app/rt/indexes/"; //the indexes folder url
						let x64 : string = (fasta_size > size_threshold ? "1" : ""); //if 64-bit, add a 1 to the file extension

						let sIndexes = 
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
							for(let k : number = 0; k != sIndexes.length; ++k)
							{
								fs.accessSync(sIndexes[k],fs.constants.F_OK | fs.constants.R_OK);
							}
							//everything exist
							for(let k : number = 0; k != sIndexes.length; ++k)
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
					}
				}
			}
		},5000
	);
}