/** 
 *	A class wrapper around node's spawn_process facilities.
 *	Automatically pipes a process' stdout and stderr to a renderer window defined by callBackObj,
 *	to channel callBackChannel. Also notifies renderer window upon process completion with process'
 *	return code. Optionally unbuffers process' output streams before forwarding to window.
 * @module req/main/Job
 */
import * as spawn from "child_process";

import {SpawnRequestParams} from "./../JobIPC";
export interface JobCallBackObject
{
	send : (
		callBackChannel : string,params : SpawnRequestParams
	) => void;
}
export class Job
{
    /**  
     * @param {string} processName - the name of the executable to invoke
     * @param {Array<string>} args - an array of strings to pass to the executable as CL arguments
     * @param {string} callBackChannel - channel to forward data over on callBackObj
     * @param {bool} unBuffer - un buffer stdout and stderr before forwarding
     * @param {any} callBackObj - some object with a method send(string) : void.
     * @param {any} extraData - JSON object to be forwarded to originator on every callback
     */
	private process : spawn.ChildProcess;
	public pid : number;
	public processName : string;
	public args : Array<string>;
	public callBackChannel : string;
	public unBuffer : boolean;
	public callBackObj : JobCallBackObject;
	public done : boolean;
	public running : boolean;
	public extraData : any;
	public retCode : number | undefined;
	public constructor(
		processName : string,
		args : Array<string>,
		callBackChannel : string,
		unBuffer : boolean,
		callBackObj : JobCallBackObject,
		extraData : any
		)
	{
		this.processName = processName;
		this.args = args;
		this.callBackChannel = callBackChannel;
		this.callBackObj = callBackObj;
		this.done = false;
		this.running = false;
		this.unBuffer = unBuffer;
		this.extraData = extraData;
		this.retCode = undefined;
	}
    /**
     * @param {Buffer} data - data buffer to unbuffer to string
     * @returns {string} unbuffered data
     */
	unBufferBufferedData(data : Buffer) : string
	{ 
		let unBufferedData : string = "";
		for(let i in data)
		{
			if(data[i] != 0 && data[i] != undefined)
			{
				let char = String.fromCharCode(data[i]);
				if(char && char != undefined)
					unBufferedData += char;
			}
		}
		unBufferedData = unBufferedData.replace(new RegExp("\\u0000","g"),"");
		return unBufferedData;
	}
    
	EmitStdo(data : Buffer,err : boolean,out : boolean) : void
	{
		let obj : SpawnRequestParams;
		if(!this.unBuffer)
		{
			obj = <SpawnRequestParams>{
				processName : this.processName,
				args : this.args,
				data : data,
				done : this.done,
				extraData : this.extraData
			};
			if(err && !out)
				obj.stderr = true;
			if(out && !err)
				obj.stdout = true;
			
		}
		if(this.unBuffer)
		{
			obj = <SpawnRequestParams>{
				processName : this.processName,
				args : this.args,
				done : this.done,
				unBufferedData : this.unBufferBufferedData(data),
				extraData : this.extraData
			};
			if(err && !out)
				obj.stderr = true;
			if(out && !err)
				obj.stdout = true;
		}
		this.callBackObj.send(this.callBackChannel,obj);
	}
	OnOut(data : Buffer) : void
	{
		this.EmitStdo(data,false,true);
	}
	OnErr(data : Buffer) : void
	{
		this.EmitStdo(data,true,false);
	}
	OnSpawnError(err : string) : void
	{
		throw new Error("\nCould not spawn process: "+this.processName+" "+err+"\n CWD: "+process.cwd()+"\n");
	}
	OnComplete(retCode : number) : void
	{
		this.done = true;
		this.running = false;
		this.retCode = retCode;
		let obj : SpawnRequestParams;
		obj = <SpawnRequestParams>{
			processName : this.processName,
			args : this.args,
			done : this.done,
			retCode : retCode,
			extraData : this.extraData
		};
		this.callBackObj.send(this.callBackChannel,obj);
	}
	Run()
	{
		this.process = spawn.spawn(this.processName,this.args);
		this.pid = this.process.pid;
		this.running = true;
		var obj = this;
		this.process.stderr.on
		(
			'data',function(data : Buffer)
			{
				obj.OnErr(data);
			}
		);
		this.process.stdout.on
		(
			'data',function(data : Buffer)
			{
				obj.OnOut(data);
			}
		)
		this.process.on
		(
			'exit',function(retCode : number)
			{
				obj.OnComplete(retCode);
			}
		);
		this.process.on
		(
			'error',function(err : string)
			{
				obj.OnSpawnError(err);
			}
		);
	}
}
