import {SpawnRequestParams} from "./JobIPC";
import {Fasta} from "./fasta";
import Fastq from "./fastq";
import {CompletionFlags} from "./operations/atomicOperations";
export {CompletionFlags} from "./operations/atomicOperations";

export interface AtomicOperationIPC
{
    opName? : string;
    channel? : string;
    key? : string;
    uuid? : string;

    alignuuid? : string;
    figureuuid? : string;
    colour? : string;
    alignParams? : {fasta : Fasta,fastq1 : Fastq,fastq2 : Fastq,type : "patho" | "host"};

    token? : string;
}

export interface AtomicOperationForkEvent
{
    setData? : boolean;
    finishedSettingData? : boolean;
    data? : any;

    run? : boolean;
    update? : boolean;
    flags? : CompletionFlags;
}