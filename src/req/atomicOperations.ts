import {EventEmitter} from "events";
import * as fs from "fs";
import {SpawnRequestParams} from "./JobIPC";
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
    public done : boolean;

    public abstract run() : void;
    public abstract setData(data : any) : void;

    public update : (arg : SpawnRequestParams) => void;
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

export function enQueue(opName : string,data : any) : void
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
                op.update = function(arg : SpawnRequestParams){

                if(op.done)
                {
                    for(let i = 0; i != op.generatedArtifacts.length; ++i)
                    {
                        fs.unlinkSync(op.generatedArtifacts[i]);
                    }
                }

                updates.emit(op.name,arg);
            }
            return;
        }
    }
    console.log("Could not enQueue");
}