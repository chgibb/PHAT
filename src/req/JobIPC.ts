export interface SpawnRequestParams
{
    processName : string;
    args : Array<string>;
    callBackChannel : string;
    unBuffer : boolean;
    extraData? : any;
    done? : boolean;
    retCode? : number;
}