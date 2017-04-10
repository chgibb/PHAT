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

let registeredOperations : Array<AtomicOperation>;
let operationsQueue : Array<AtomicOperation>;

export function register(opName : string,op : AtomicOperation) : void
{
    for(let i = 0; i != registeredOperations.length; ++i)
    {
        if(registeredOperations[i].name == opName)
            return;
    }
    registeredOperations.push(op);
}

export function enQueue(opName : string,data : any) : void
{
    for(let i = 0; i != registeredOperations.length; ++i)
    {
        if(registeredOperations[i].name == opName)
        {
            operationsQueue.push(new (<any>registeredOperations[i]));
            return;
        }
    }
}