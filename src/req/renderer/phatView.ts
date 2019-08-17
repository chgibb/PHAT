import {AtomicOperation} from "../operations/atomicOperations";

export interface PHATView
{
    props : {
        operations? : Array<AtomicOperation<any>>;
    }
}
