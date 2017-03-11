/// <reference types="fs-extra" />
import * as fse from "fs-extra";
import * as fs from "fs";
import canRead from "./../canRead";
import getContigs from "./../faiParser";
import fsAccess from "./../../fsAccess";
import {SpawnRequestParams} from "./../../JobIPC";
import Input from "./../Input";
export default function replyFromSamTools(channel : string,arg : SpawnRequestParams,model : Input) : void
{
	if(arg.args[0] == "faidx")
	{
		if(arg.done)
		{
			let idx : number = -1;
			for(let i : number = 0; i != model.fastaInputs.length; ++i)
			{
				if(model.fastaInputs[i].name == arg.extraData)
				{
					idx = i;
					break;
				}
			}
			if(idx == -1)
				throw new Error("Can not create faidx index for fasta which does not exist!");
				
			let fai : string = fsAccess("resources/app/rt/indexes/"+model.fastaInputs[idx].alias+".fai",false);
			//samtools will place artifact in same dir as input file
			let src : string = model.fsAccess(arg.extraData+".fai");

			fse.move
			(
				src,fai,{clobber : true},function(err : Error)
				{
					if(err)
					{
						model.fastaInputs[idx].indexing = false;
						throw new Error(err.toString());
					}
					model.fastaInputs[idx].contigs = getContigs(fai);
					let bowTieIndex : string = fsAccess('resources/app/rt/indexes/'+model.fastaInputs[idx].alias,false);
					model.fastaInputs[idx].fai = fai;
					let args : Array<string> = <Array<string>>[];
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