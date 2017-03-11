interface KeySubObj
{
	channel : string;
	key : string;
	replyChannel : string
}
export let keySubs = new Array();

export function subToKey(sub : KeySubObj) : void
{
	keySubs.push(
		{
			channel : sub.channel,
			key : sub.key,
			replyChannel : sub.replyChannel
		}
	);
}
export function unSubToKey(sub : KeySubObj)
{
	for(let i : number = keySubs.length - 1; i >= 0; --i)
	{
		if(keySubs[i].channel == sub.channel &&
		   keySubs[i].key == sub.key &&
		   keySubs[i].replyChannel == sub.replyChannel)
		{
			keySubs.splice(i,1);
		}
	}
}
/*module.exports.unSubChannel = function(replyChannel)
{
	for(var i in module.exports.keySubs)
	{
		if(module.exports.keySubs[i])
		{
			if(module.exports.keySubs[i].replyChannel)
			{
				if(module.exports.keySubs[i].replyChannel == replyChannel)
				{
					module.exports.keySubs[i] = null;
				}
			}
		}
	}
}*/