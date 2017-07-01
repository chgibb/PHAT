import {EventEmitter} from "events";
import * as fs from "fs";

const uuidv4 : () => string = require("uuid/v4");
import * as rimraf from "rimraf";
import * as mkdirp from "mkdirp";

import {SpawnRequestParams} from "./../JobIPC";
import {getReadableAndWritable} from "./../getAppPath";

export abstract class AtomicOperation
{
    public generatedArtifacts : Array<string>;
	public destinationArtifacts : Array<string>;

    public generatedArtifactsDirectories : Array<string>;
	public destinationArtifactsDirectories : Array<string>;

    public logKey : string;

    public constructor()
    {
        this.generatedArtifacts = new Array<string>();
        this.destinationArtifacts = new Array<string>();
        this.generatedArtifactsDirectories = new Array<string>();
        this.destinationArtifactsDirectories = new Array<string>();

        this.flags = new CompletionFlags();
    }
    public getGeneratedArtifacts() : Array<string>
    {
        return this.generatedArtifacts;
    }
    public setGeneratedArtifacts(artifacts : Array<string>) : void
    {
        this.generatedArtifacts = artifacts;
    }
    public getDestinationArtifacts() : Array<string>
    {
        return this.destinationArtifacts;
    }
    public setDestinationArtifacts(artifacts : Array<string>) : void
    {
        this.destinationArtifacts = artifacts;
    }
    public getGeneratedArtifactsDirectories() : Array<string>
    {
        return this.generatedArtifactsDirectories;
    }
    public setGeneratedArtifactsDirectories(artifacts : Array<string>) : void
    {
        this.generatedArtifactsDirectories = artifacts;
    }
    public getDestinationArtifactsDirectories() : Array<string>
    {
        return this.destinationArtifactsDirectories;
    }
    public setDestinationArtifactsDirectories(artifacts : Array<string>) : void
    {
        this.destinationArtifactsDirectories = artifacts;
    }

    public name : string;

    public flags : CompletionFlags;

    public setFailure(flags : CompletionFlags) : void
    {
        flags.done = true;
        flags.success = false;
        flags.failure = true;
    }
    public setSuccess(flags : CompletionFlags) : void
    {
        flags.done = true;
        flags.success = true;
        flags.failure = false;
    }

    public running : boolean;

    public abstract run() : void;
    public abstract setData(data : any) : void;

    public update : () => void;

    public spawnUpdate : SpawnRequestParams;
    public progressMessage : string;
    public step : number;
    public totalSteps : number;
    public extraData : any;

    public abortOperationWithMessage(msg : string) : void
    {
        this.setFailure(this.flags);
        this.extraData = msg;
        this.update();
    }

    public logObject(obj : any) : void
    {
        logString(this.logKey,JSON.stringify(obj));
    }
}
export class CompletionFlags
{
    public done : boolean;
    public success : boolean;
    public failure : boolean;
    public constructor()
    {
        this.done = false;
        this.success = false;
        this.failure = false;
    }
}
export interface RegisteredAtomicOperation
{
    name : string;
    op : typeof AtomicOperation;
}

export let registeredOperations : Array<RegisteredAtomicOperation> = new Array<RegisteredAtomicOperation>();
export let operationsQueue : Array<AtomicOperation> = new Array<AtomicOperation>();

export let updates : EventEmitter = new EventEmitter();

export function clearOperationsQueue()
{
    operationsQueue = new Array<AtomicOperation>();
}

export function register(opName : string,op : typeof AtomicOperation) : void
{
    for(let i = 0; i != registeredOperations.length; ++i)
    {
        if(registeredOperations[i].name == opName)
        {
            console.log("Could not register");
            return;
        }
    }
    registeredOperations.push(
        <RegisteredAtomicOperation>{
            name : opName,
            op : op
            }
    );
}

export function cleanGeneratedArtifacts(op : AtomicOperation) : void
{
    for(let i = 0; i != op.generatedArtifacts.length; ++i)
    {
        try
        {
            fs.unlinkSync(op.generatedArtifacts[i]);
        }
        catch(err){}
    }
    for(let i = 0; i != op.generatedArtifactsDirectories.length; ++i)
    {
        try
        {
            rimraf.sync(op.generatedArtifactsDirectories[i]);
        }
        catch(err){}
    }
}

export function cleanDestinationArtifacts(op : AtomicOperation) : void
{
    for(let i = 0; i != op.destinationArtifacts.length; ++i)
    {
        try
        {
            fs.unlinkSync(op.destinationArtifacts[i]);
        }
        catch(err){}
    }
    for(let i = 0; i != op.destinationArtifactsDirectories.length; ++i)
    {
        try
        {
            rimraf.sync(op.destinationArtifactsDirectories[i]);
        }
        catch(err){}
    }
}
export function addOperation(opName : string,data : any) : void
{
    for(let i = 0; i != registeredOperations.length; ++i)
    {
        if(registeredOperations[i].name == opName)
        {
            let op : AtomicOperation = new (<any>(registeredOperations[i].op))();
            op.name = registeredOperations[i].name;
            op.setData(data);
            op.update = function(){
                if(op.flags.done)
                {
                    cleanGeneratedArtifacts(op);
                    if(op.flags.failure)
                    {
                        cleanDestinationArtifacts(op);
                        closeLog(op.logKey,"failure");
                    }
                    else if(op.flags.success)
                    {
                        closeLog(op.logKey,"success");
                    }
                }
                updates.emit(op.name,op);
            }
            operationsQueue.push(op);
            return;
        }
    }
    console.log("Could not add operation "+opName);
}

export function runOperations(maxRunning : number) : void
{
    
    //console.log(`Called ${operationsQueue.length}`);
    let currentRunning : number = 0;
    for(let i = 0; i != operationsQueue.length; ++i)
    {
        //console.log(`${operationsQueue[i].name} ${operationsQueue[i].running}`);

        if(operationsQueue[i].running)
            currentRunning++;
        if(currentRunning >= maxRunning)
            break;
        if(!operationsQueue[i].running)
        {
            operationsQueue[i].run();
            operationsQueue[i].running = true;
            currentRunning++;
        }
        
    }

    for(let i = operationsQueue.length - 1; i >= 0; --i)
    {
        if(operationsQueue[i].flags.done)
        {
            if(operationsQueue[i].flags.success || operationsQueue[i].flags.failure)
            {
                //console.log(`spliced ${operationsQueue[i].fastq.path}`);
                operationsQueue.splice(i,1);
            }
        }
    }
}

let logRecordFile = getReadableAndWritable(`logs/logRecords`);
class LogRecord
{
    name : string = "";
    description : string = "";
    status : string = "";
    runTime : number = 0;
    startEpoch : number = 0;
    endEpoch : number = 0;
    uuid : string = "";
}

interface OpenLogStream
{
    stream : fs.WriteStream;
    startEpoch : number;
    name : string;
    description : string;
    uuid : string;
}
let openLogStreams : Array<OpenLogStream> = new Array<OpenLogStream>();

export function openLog(name : string,description : string) : string
{
    let uuid = uuidv4();
    mkdirp.sync(getReadableAndWritable(`logs/${uuid}`));
    openLogStreams.push(
        <OpenLogStream>{
            stream : fs.createWriteStream(getReadableAndWritable(`logs/${uuid}/log`)),
            startEpoch : Date.now(),
            name : name,
            description : description,
            uuid : uuid
        }
    );
    return uuid;
}

export function closeLog(uuid : string,status : string) : LogRecord | undefined
{
    for(let i = 0; i != openLogStreams.length; ++i)
    {
        if(openLogStreams[i].uuid == uuid)
        {
            openLogStreams[i].stream.close();
            let logRecord : LogRecord = new LogRecord();

            logRecord.endEpoch = Date.now();

            logRecord.name = openLogStreams[i].name;

            logRecord.description = openLogStreams[i].description;

            logRecord.status = status;

            logRecord.startEpoch = openLogStreams[i].startEpoch;

            logRecord.uuid = openLogStreams[i].uuid;

            let start = new Date(logRecord.startEpoch);
            let end = new Date(logRecord.endEpoch);

            logRecord.runTime = Math.abs((<any>end) - (<any>start));

            return logRecord;
        }
    }
    return undefined;
}

export function recordLogRecord(record : LogRecord) : void
{
    fs.appendFileSync(logRecordFile,JSON.stringify(record));
}

export function logString(uuid : string,data : string) : void
{
    for(let i = 0; i != openLogStreams.length; ++i)
    {
        if(openLogStreams[i].uuid == uuid)
        {
            openLogStreams[i].stream.write("\n"+data);
            return;
        }
    }
}