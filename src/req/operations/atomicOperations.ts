import {EventEmitter} from "events";
import * as fs from "fs";
import {SpawnRequestParams} from "./../JobIPC";

import * as rimraf from "rimraf";
export abstract class AtomicOperation
{
    public generatedArtifacts : Array<string>;
	public destinationArtifacts : Array<string>;

    public generatedArtifactsDirectories : Array<string>;
	public destinationArtifactsDirectories : Array<string>;
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
    public extraData : any;

    public abortOperationWithMessage(msg : string) : void
    {
        this.setFailure(this.flags);
        this.extraData = msg;
        this.update();
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
                        cleanDestinationArtifacts(op);
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