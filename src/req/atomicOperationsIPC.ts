import {ProjectManifest} from "./projectManifest"
import {Fasta} from "./fasta";
import Fastq from "./fastq";
import {alignData} from "./alignData";
import {CompletionFlags,LogRecord} from "./operations/atomicOperations";
export {CompletionFlags} from "./operations/atomicOperations";

/**
 * Interface used to request operation spawning and for recieving operation status updates
 * over IPC
 * 
 * @export
 * @interface AtomicOperationIPC
 */
export interface AtomicOperationIPC
{
    opName? : string;
    channel? : string;
    key? : string;
    uuid? : string;

    alignuuid? : string;
    figureuuid? : string;
    colour? : string;
    alignParams? : {fasta : Fasta,fastq1 : Fastq,fastq2 : Fastq};

    token? : string;

    name? : string;
    proj? : ProjectManifest;
    externalProjectPath? : string;
    filePath? : string;

    pileupViewerParams? : {
        align : alignData,
        contig : string,
        start : number,
        stop : number
    }
}

/**
 * Interface used to communicate with AtomicOperations running in forked processes
 * 
 * @export
 * @interface AtomicOperationForkEvent
 */
export interface AtomicOperationForkEvent
{
    setData? : boolean;
    finishedSettingData? : boolean;
    data? : any;
    name? : string;
    description? : string;

    run? : boolean;
    update? : boolean;
    flags? : CompletionFlags;
    logRecord? : LogRecord;
    progressMessage? : string;
    step? : number;
}