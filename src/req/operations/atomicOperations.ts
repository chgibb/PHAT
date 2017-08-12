import {EventEmitter} from "events";
import * as fs from "fs";
import * as readline from "readline";

const uuidv4 : () => string = require("uuid/v4");
import * as rimraf from "rimraf";
import * as mkdirp from "mkdirp";

import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import {SpawnRequestParams} from "./../JobIPC";
import {getReadableAndWritable} from "./../getAppPath";

export abstract class AtomicOperation
{
    public generatedArtifacts : Array<string>;
	public destinationArtifacts : Array<string>;

    public generatedArtifactsDirectories : Array<string>;
	public destinationArtifactsDirectories : Array<string>;

    public logRecord : LogRecord;
    public closeLogOnFailure : boolean;
    public closeLogOnSuccess : boolean;

    public name : string;
    
    public flags : CompletionFlags;

    public update : () => void;
    
    public spawnUpdate : SpawnRequestParams;
    public progressMessage : string;
    public step : number;
    public totalSteps : number;
    public extraData : any;

    public running : boolean;

    public ignoreScheduler : boolean;


    public constructor()
    {
        this.generatedArtifacts = new Array<string>();
        this.destinationArtifacts = new Array<string>();
        this.generatedArtifactsDirectories = new Array<string>();
        this.destinationArtifactsDirectories = new Array<string>();

        this.closeLogOnFailure = true;
        this.closeLogOnSuccess = true;

        this.flags = new CompletionFlags();

        this.running = false;

        this.ignoreScheduler = false;
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

    

    public abstract run() : void;
    public abstract setData(data : any) : void;

    

    public abortOperationWithMessage(msg : string) : void
    {
        this.setFailure(this.flags);
        this.extraData = msg;
        this.update();
    }

    public logObject(obj : any) : void
    {
        logString(this.logRecord,JSON.stringify(obj));
    }
}

export class ForkLogger extends AtomicOperation
{
    public constructor()
    {
        super();
    }
    public setData(data : any){}
    public run(){}
}

export function handleForkFailures(logger? : ForkLogger,progressMessage? : string)
{
    let signalFailure = function(err : string){
        console.log(err);
        let flags : CompletionFlags = new CompletionFlags();
        flags.done = true;
        flags.failure = true;
        flags.success = false;

        let failureObj = <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err,
            progressMessage : progressMessage
        };
        if(logger !== undefined)
        {
            logger.logObject(failureObj);
            closeLog(logger.logRecord,"failure");
            failureObj.logRecord = logger.logRecord;
        }

        process.send(failureObj);
        process.exit(1);

    };
    (process as NodeJS.EventEmitter).on("uncaughtException",function(err : Error){
        signalFailure(`${err.toString()} ${err.stack}`);
    });

    process.on("unhandledRejection",function(err : Error){
        signalFailure(`${err.toString()} ${err.stack}`);
    });
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
export let onComplete : (op : AtomicOperation) => void = undefined;
export function setOnComplete(func : (op : AtomicOperation) => void) : void
{
    onComplete = func;
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
                        op.logObject(op.extraData);
                        cleanDestinationArtifacts(op);
                        if(op.closeLogOnFailure)
                        {
                            closeLog(op.logRecord,"failure");
                            recordLogRecord(op.logRecord);
                        }
                    }
                    else if(op.flags.success)
                    {
                        if(op.closeLogOnSuccess)
                        {
                            closeLog(op.logRecord,"success");
                            recordLogRecord(op.logRecord);
                        }
                    }
                    if(onComplete)
                        onComplete(op);
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
    for(let i = 0; i != operationsQueue.length; ++i)
    {
        if(operationsQueue[i].ignoreScheduler && !operationsQueue[i].running)
        {
            operationsQueue[i].running = true;
            operationsQueue[i].run();
        }
    }
    //console.log(operationsQueue);
    let currentRunning : number = 0;
    for(let i = 0; i != operationsQueue.length; ++i)
    {
        if(operationsQueue[i] !== undefined)
        {
            if(operationsQueue[i].running)
                currentRunning++;
            if(currentRunning >= maxRunning)
                break;
            if(!operationsQueue[i].running)
            {
                operationsQueue[i].running = true;
                currentRunning++;
                operationsQueue[i].run();
            }
        }
    }
    for(let i = operationsQueue.length - 1; i >= 0; --i)
    {
        if(operationsQueue[i].flags.done)
        {
            if(operationsQueue[i].flags.success || operationsQueue[i].flags.failure)
            {
                operationsQueue.splice(i,1);
            }
        }
        if(operationsQueue[i] === undefined)
            operationsQueue.splice(i,1);
    }
}

export let logRecordFile = getReadableAndWritable(`logs/logRecords`);
export class LogRecord
{
    name : string = "";
    description : string = "";
    status : string = "";
    runTime : number = 0;
    startEpoch : number = 0;
    endEpoch : number = 0;
    uuid : string = "";
}

export function getLogDirectory(logRecord : LogRecord) : string
{
    return getReadableAndWritable(`logs/${logRecord.uuid}`);
}

export function getLogFile(logRecord : LogRecord) : string
{
    return getReadableAndWritable(`logs/${logRecord.uuid}/log`);
}

export function openLog(name : string,description : string) : LogRecord
{
    let uuid = uuidv4();
    

    let res : LogRecord = new LogRecord();
    res.name = name;
    res.description = description;
    res.startEpoch = Date.now();
    res.uuid = uuid;

    mkdirp.sync(getLogDirectory(res));
    fs.appendFileSync(getLogFile(res),"");
    return res;
}

export function closeLog(logRecord : LogRecord,status : string) : void
{
    if(!logRecord || !logRecord.uuid)
        throw new Error(`Failed to close log with status ${status} which does not exist`);
    logRecord.endEpoch = Date.now();
    logRecord.status = status;

    let start = new Date(logRecord.startEpoch);
    let end = new Date(logRecord.endEpoch);

    logRecord.runTime = Math.abs((<any>end) - (<any>start));

}

export function recordLogRecord(record : LogRecord) : void
{
    if(record === undefined)
        throw new Error(`Cannot close log with record which does not exist`);
    mkdirp.sync(getReadableAndWritable(`logs`));
    fs.appendFileSync(logRecordFile,JSON.stringify(record)+"\n");
}

export function logString(logRecord : LogRecord,data : string) : void
{
    if(!logRecord || !logRecord.uuid)
        throw new Error(`Cannot write string to log which does not exist`);

    fs.appendFileSync(getLogFile(logRecord),`${"\n"}${data}`);

}

export async function getLogRecords(last : number) : Promise<Array<LogRecord>>
{
    return new Promise<Array<LogRecord>>((resolve,reject) => {
        let lines : Array<string> = new Array<string>();
        let res : Array<LogRecord> = new Array<LogRecord>();
        try
        {
            let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
                input : fs.createReadStream(logRecordFile)
            });
            rl.on("line",function(line : string){
                lines.push(line);
            });
            rl.on("close",function(){
                lines = lines.reverse();
                for(let i = 0; i != last; ++i)
                {
                    if(i == lines.length)
                    {
                        return resolve(res);
                    }
                    res.push(JSON.parse(lines[i]));
                }
                resolve(res);
            });
        }
        catch(err){}        
    });
}