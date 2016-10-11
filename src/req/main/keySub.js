module.exports.keySubs = new Array();

module.exports.subToKey = function(channel,key,replyChannel)
{
	module.exports.keySubs.push({channel:channel,key:key,replyChannel:replyChannel});
}
function unSubToKey(channel,key,replyChannel)
{
	for(var i in module.exports.keySubs)
	{
		if(module.exports.keySubs[i].channel == channel &&
		   module.exports.keySubs[i].key == key &&
		   module.exports.keySubs[i].replyChannel == replyChannel)
		{
			module.exports.keySubs[i] = null;
		}
	}
}
module.exports.unSubChannel = function(replyChannel)
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
}