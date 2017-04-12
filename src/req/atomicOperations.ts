import {EventEmitter} from "events";
import * as fs from "fs";
import {SpawnRequestParams} from "./JobIPC";

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

    public update : (arg : OperationUpdate) => void;

    public abortOperationWithMessage(msg : string) : void
    {
        this.setFailure(this.flags);
        this.update(<OperationUpdate>{
            op : this,
            extraData : msg
        });
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
export interface OperationUpdate
{
    spawnUpdate? : SpawnRequestParams;
    op? : AtomicOperation;
    extraData? : any;
}

let registeredOperations : Array<AtomicOperation> = new Array<AtomicOperation>();
export let operationsQueue : Array<AtomicOperation> = new Array<AtomicOperation>();

export let updates : EventEmitter = new EventEmitter();

export function register(opName : string,op : AtomicOperation) : void
{
    for(let i = 0; i != registeredOperations.length; ++i)
    {
        if(registeredOperations[i].name == opName)
        {
            console.log("Could not register");
            return;
        }
    }
    registeredOperations.push(op);
    registeredOperations[registeredOperations.length-1].name = opName;
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
            //Push a copy of the class pointed to by registeredOperations[i]
            operationsQueue.push(
                Object.assign(
                    Object.create(<any>registeredOperations[i]),
                    (<any>registeredOperations[i])
                    )
                );
                let op = operationsQueue[operationsQueue.length - 1];
                op.setData(data);
                op.update = function(oup : OperationUpdate){
                    if(op.flags.done)
                    {
                        cleanGeneratedArtifacts(op);
                        if(op.flags.failure)
                            cleanDestinationArtifacts(op);
                    }

                    updates.emit(op.name,oup);
                }
            return;
        }
    }
    console.log("Could not enQueue");
}

export function runOperations(maxRunning : number) : void
{
    let currentRunning : number = 0;
    for(let i = 0; i != operationsQueue.length; ++i)
    {
        if(operationsQueue[i].running)
            currentRunning++;
        if(currentRunning >= maxRunning)
            continue;
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
                operationsQueue.splice(i,1);
            }
        }
    }
}