/**
 * Functions for dealing with retrieving state. Deals with retrieval requests whose origins aer inside or 
 * outside the same process.
 * @module req/main/getState
 */


/**
 * Retrieves state in response to a request from an IPC message.
 * Returns the object in state[channel][arg.key]
 * @param {string} channel - channel state is stored on
 * @param {event} - event object from IPC event
 * @param {any} arg - IPC object from IPC event
 */
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

/**
 * Retrieves state in response to a request from an IPC message.
 * Returns the object in state[channel][arg.key]
 * @param {string} channel - channel state is stored on
 * @param {event} - event object from IPC event
 */
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