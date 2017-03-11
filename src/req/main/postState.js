/**
 * Functions for dealing with state saving. Deals with save requests whose origins are inside
 * or outside the same process.
 * @module req/main/postState
*/


var persistState = require('./persistState');
var keySub = require('./keySub');
var window = require('./window');
/**
 * Saves state coming from an ipc message.
 * assumes state to be saved is in arg.val and will be saved in state[channel][arg.key]
 * Also broadcasts a change event with a copy of the new data over ipc to all renderer windows
 * who subscribed to changes on state[channel][arg.key]. Will delete subscription entries for windows 
 * that have been closed as they're encountered. Will also delete closed window handles as they're encountered.
 * @param {string} channel - channel to save to
 * @param {any} event - event object form ipc event
 * @param {any} arg - 
*/
module.exports.postStateIPC = function(channel,event,arg)
{
	/*
	if(arg.action === "postState")
	{
		//console.log('\033[2J');
		if(state[channel])
		{
			state[channel][arg.key] = arg.val;
			persistState.persistState();
		}
		else
		{
			state[channel] = {};
			state[channel][arg.key] = arg.val;
			persistState.persistState();
		}
		console.log(JSON.stringify(state,undefined,4));
		
		//send change event for this key to all subscribers
		for(var i in keySub.keySubs)
		{
			if(keySub.keySubs[i])
			{
				try
				{
					if(keySub.keySubs[i].channel == channel)
					{
						if(keySub.keySubs[i].key == arg.key)
						{
							arg.channel = channel;
							arg.action = "keyChange";
							for(var j in window.windows)
							{
								try
								{
									if(window.windows[j])
									{
										if(window.windows[j].name == keySub.keySubs[i].replyChannel)
										{
											if(window.windows[j].window)
											{
												if(window.windows[j].window.webContents)
												{
													window.windows[j].window.webContents.send(keySub.keySubs[i].replyChannel,arg);
												}
											}
										}
									}
								}
								//window has been closed.
								//Delete its handle.
								catch(err)
								{
									console.log(err);
									window.windows[j] = null;
								}
							}
						}
					}
				}
				//Window has been closed.
				//Remove its subscription.
				catch(err)
				{
					console.log(err);
					keySub.keySubs[i] = null;
				}
			}
		}
	}*/
}
/**
 * Saves state coming from another function/thread in the same process.
 * @param {string} channel
 * @param {string} key
 * @param {any} val
*/
module.exports.postState = function(channel,key,val)
{
	/*
	if(state[channel])
	{
		state[channel][key] = val;
		persistState.persistState();
	}
	else
	{
			state[channel] = {};
			state[channel][key] = val;
			persistState.persistState();
	}*/

}
