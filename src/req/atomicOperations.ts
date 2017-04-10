import {EventEmitter} from "events";
import {SpawnRequestParams} from "./JobIPC";
export abstract class AtomicOperation
{
    public abstract getGeneratedArtifacts() : Array<string>;
    public abstract setGeneratedArtifacts(artifacts : Array<string>) : void;
    public abstract getDestinationArtifacts() : Array<string>;
    public abstract setDestinationArtifacts(artifacts : Array<string>) : void;

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
            operationsQueue[operationsQueue.length - 1].setData(data);
            operationsQueue[operationsQueue.length - 1].update = function(arg : SpawnRequestParams){
                updates.emit(operationsQueue[operationsQueue.length - 1].name,arg);
            }
            return;
        }
    }
    console.log("Could not enQueue");
}