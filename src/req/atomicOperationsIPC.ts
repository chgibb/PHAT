import {SpawnRequestParams} from "./JobIPC";
import {OperationUpdate,CompletionFlags} from "./main/operations/atomicOperations";
export {OperationUpdate,CompletionFlags} from "./main/operations/atomicOperations";

export interface AtomicOperationIPC
{
    opName? : string;
    channel? : string;
    key? : string;
    uuid? : string;
    oup? : OperationUpdate;
}