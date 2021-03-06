import {ProjectManifest} from "./projectManifest";
import {Fasta} from "./fasta";
import {Fastq} from "./fastq";
import {AlignData} from "./alignData";
import {BLASTSegmentResult} from "./BLASTSegmentResult";
import {CircularFigure} from "./renderer/circularFigure/circularFigure";
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
    blastSegmentResult? : BLASTSegmentResult;
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
    log10Scale? : boolean;

    toDock? : string;
    dockTarget? : string;

    refName? : string;
    guestinstance? : number;

    id? : number;

    newTitle? : string;

    start? : number;

    stop? : number;
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