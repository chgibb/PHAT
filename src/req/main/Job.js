/*
	Part of the PHAT Project
	Author: gibbc@tbh.net
*/
/*
	A class wrapper around node's spawn_process facilities.
	Automatically pipes a process' stdout and stderr to a renderer window defined by callBackObj,
	to channel callBackChannel. Also notifies renderer window upon process completion with process'
	return code. Optionally unbuffers process' output streams before forwarding to window.
*/
module.exports = class
{
	constructor(processName,args,callBackChannel,unBuffer,callBackObj,extraData)
	{
		this.processName = processName;
		this.args = args;
		this.callBackChannel = callBackChannel;
		this.callBackObj = callBackObj;
		this.done = false;
		this.running = false;
		this.unBuffer = unBuffer;
		this.extraData = extraData;
	}
	unBufferBufferedData(data)
	{ 
		var unBufferedData = "";
		for(var i in data)
		{
			if(data[i] != 0 && data[i] != undefined)
			{
				var char = String.fromCharCode(data[i]);
				if(char && char != undefined)
					unBufferedData += char;
			}
		}
		unBufferedData = unBufferedData.replace(new RegExp("\\u0000","g"),"");
		return unBufferedData;
	}
	OnErr(data)
	{
		if(!this.unBuffer)
		{
			this.callBackObj.send
			(
				this.callBackChannel,
				{
					processName : this.processName,
					args : this.args,
					data : data,
					done : this.done,
					extraData : this.extraData
				}
			);
		}
		if(this.unBuffer)
		{
			this.callBackObj.send
			(
				this.callBackChannel,
				{
					processName : this.processName,
					args : this.args,
					done : this.done,
					unBufferedData : this.unBufferBufferedData(data),
					extraData : this.extraData
				}
			);
		}
	}
	OnOut(data)
	{
		this.OnErr(data);
	}
	OnSpawnError(err)
	{
		throw new Error("Could not spawn process: "+this.processName);
	}
	OnComplete(retCode)
	{
		this.done = true;
		this.running = false;
		this.callBackObj.send
		(
			this.callBackChannel,
			{
				processName : this.processName,
				args : this.args,
				done : this.done,
				retCode : retCode,
				extraData : this.extraData
			}
		);
	}
	Run()
	{
		var spawn = require('child_process');
		this.process = spawn.spawn(this.processName,this.args);
		this.running = true;
		var obj = this;
		this.process.stderr.on
		(
			'data',function(data)
			{
				obj.OnErr(data);
			}
		);
		this.process.stdout.on
		(
			'data',function(data)
			{
				obj.OnOut(data);
			}
		)
		this.process.on
		(
			'exit',function(retCode)
			{
				obj.OnComplete(retCode);
			}
		);
		this.process.on
		(
			'error',function(err)
			{
				obj.OnSpawnError(err);
			}
		);
	}
}
