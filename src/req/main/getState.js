

module.exports.getStateIPC = function(channel,event,arg)
{
	if(arg.action === "getState")
	{
		if(state[channel])
		{
			if(state[channel][arg.key])
			{
				arg.val = state[channel][arg.key];
			}
			else
			{
				arg.val = 0;
			}
			if(arg.replyChannel)
				event.sender.send(arg.replyChannel,arg);
			return;
		}
	}
}
module.exports.getState = function(channel,key)
{
	if(state[channel])
	{
		if(state[channel][key])
			return state[channel][key];
	}
	if(!state[channel])
		console.log("Channel "+channel+"is undefined");
	if(state[channel])
	{
		if(!state[channel][key])
			console.log("key "+key+" in channel "+channel+"is undefined");
	}
}