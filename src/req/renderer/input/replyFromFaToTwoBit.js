module.exports = function(channel,arg,model)
{
    if(arg.done)
	{
	    if(arg.retCode == 0)
		{
			for(let i = 0; i != model.fastaInputs.length; ++i)
			{
			    if(model.fastaInputs[i].name == arg.args[0])
				{
					var twoBit = model.fsAccess('rt/indexes/'+model.fastaInputs[i].alias+'.2bit');
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
					return true;
				}
			}
		}
	}
}