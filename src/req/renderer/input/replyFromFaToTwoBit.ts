import {SpawnRequestParams} from "./../../JobIPC";
import Input from "./../Input";
export default function replyFromFaToTwoBit(channel : string,arg : SpawnRequestParams,model : Input) : void
{
    if(arg.done)
	{
	    if(arg.retCode == 0)
		{
			for(let i : number = 0; i != model.fastaInputs.length; ++i)
			{
			    if(model.fastaInputs[i].name == arg.args[0])
				{
					let twoBit : string = model.fsAccess('rt/indexes/'+model.fastaInputs[i].alias+'.2bit');
				    model.fastaInputs[i].twoBit = twoBit;
					model.spawnHandle
					(
					    'spawn',
						{
						    action : 'spawn',
							replyChannel : 'input',
							processName : model.samTools,
							args : 
							[
							    "faidx",
								model.fastaInputs[i].name
							],
							unBuffer : true,
							extraData : model.fastaInputs[i].name
						}
					);
					return;
				}
			}
		}
	}
}