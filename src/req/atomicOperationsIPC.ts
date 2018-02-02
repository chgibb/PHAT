import {ProjectManifest} from "./projectManifest"
import {Fasta} from "./fasta";
import {Fastq} from "./fastq";
import {AlignData} from "./alignData";
import {CircularFigure} from "./renderer/circularFigure";
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

    fasta? : Fasta;
    align? : AlignData;

    alignuuid? : string;
    figureuuid? : string;
    colour? : string;
    alignParams? : {fasta : Fasta,fastq1 : Fastq,fastq2 : Fastq};
    logRecord? : LogRecord;

    token? : string;

    name? : string;
    proj? : ProjectManifest;
    externalProjectPath? : string;
    filePath? : string;

    pileupViewerParams? : {
        align : AlignData,
        contig : string,
        start : number,
        stop : number
    }
    
    compileBase? : boolean;
    figure? : CircularFigure;

    scaleFactor? : number;

    toDock? : string;
    dockTarget? : string;

    refName? : string;
    guestinstance? : number;

    id? : number;

    newTitle? : string;
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
    bamPath? : string;

    pid? : number;
}