import { EventEmitter } from "events";
import * as fs from "fs";
import * as readline from "readline";
import * as cp from "child_process";

import * as rimraf from "rimraf";

import { AtomicOperationForkEvent } from "./../atomicOperationsIPC";
import { SpawnRequestParams } from "./../JobIPC";
import { getReadableAndWritable, getReadable } from "./../getAppPath";
import { BLASTSegmentData } from './BLASTSegment';
import { CheckForUpdateData } from './CheckForUpdate';
import { ChangeTitleData } from './ChangeTitle';
import { CopyCircularFigureData } from './CopyCircularFigure';
import { DeleteCircularFigureData } from './DeleteCircularFigure';
import { DockWindowData } from './DockWindow';
import { DownloadAndInstallUpdateData } from './DownloadAndInstallUpdate';
import { GenerateQCReportData } from './GenerateQCReport';
import { ImportFileIntoProjectData } from './ImportFileIntoProject';
import { IndexFastaForBowtie2AlignmentData } from './indexFastaForBowtie2Alignment';
import { IndexFastaForHisat2AlignmentData } from './indexFastaForHisat2Alignment';
import { IndexFastaForVisualizationData } from './indexFastaForVisualization';
import { InputBamFileData } from './InputBamFile';
import { InputFastaFileData } from './inputFastaFile';
import { InputFastqFileData } from './inputFastqFile';
import { InstallUpdateData } from './InstallUpdate';
import { LinkRefSeqToAlignmentData } from './LinkRefSeqToAlignment';
import { LoadCurrentlyOpenProjectData } from './LoadCurrentlyOpenProject';
import { NewProjectData } from './NewProject';
import { OpenLogViewerData } from './OpenLogViewer';
import { OpenNoSamHeaderPromptData } from './OpenNoSamHeaderPrompt';
import { OpenPileupViewerData } from './OpenPileupViewer';
import { OpenProjectData } from './OpenProject';
import { RenderCoverageTrackForContigData } from './RenderCoverageTrack';
import { RenderSNPTrackForContigData } from './RenderSNPTrack';
import { RunBowtie2AlignmentData } from './RunBowtie2Alignment';
import { RunHisat2AlignmentData } from './RunHisat2Alignment';
import { SaveProjectData } from './SaveProject';
import { UnDockWindowData } from './UnDockWindow';

export interface OperationData {
    opName: string;
}

/**
 * Class representing some operation which should be run atomically
 * 
 * @export
 * @abstract
 * @class AtomicOperation
 */
export abstract class AtomicOperation<InputData extends OperationData>
{
    public opName: string;

    /**
     * Those files which will generated by running the operation. They will be deleted on success OR failure
     * 
     * @type {Array<string>}
     * @memberof AtomicOperation
     */
    public generatedArtifacts: Array<string>;

    /**
     * Those files which will generated as final output by the operation. They will be deleted ONLY on failure
     * 
     * @type {Array<string>}
     * @memberof AtomicOperation
     */
    public destinationArtifacts: Array<string>;


    /**
     * Those directories which will be generated by running the operation. They will be deleted on success OR failure
     * 
     * @type {Array<string>}
     * @memberof AtomicOperation
     */
    public generatedArtifactsDirectories: Array<string>;


    /**
     * Those directories which will be generated as final output by the operation. They will be deleted ONLY on failure
     * 
     * @type {Array<string>}
     * @memberof AtomicOperation
     */
    public destinationArtifactsDirectories: Array<string>;

    /**
     * Holds data allowing the operation to manage its log
     * 
     * @type {LogRecord}
     * @memberof AtomicOperation
     */
    public logRecord: LogRecord | undefined;

    /**
     * Whether the operation's log should be automatically closed upon failure
     * 
     * @type {boolean}
     * @memberof AtomicOperation
     */
    public closeLogOnFailure: boolean;


    /**
     * Whether the operation's log should be automatically closed on success
     * 
     * @type {boolean}
     * @memberof AtomicOperation
     */
    public closeLogOnSuccess: boolean;

    /**
     * Flags indicating the current running status of the operation
     * 
     * @type {CompletionFlags}
     * @memberof AtomicOperation
     */
    public flags: CompletionFlags;

    public update: (() => void) | undefined;

    public spawnUpdate: SpawnRequestParams | undefined;
    public progressMessage: string | undefined;
    public step: number | undefined;
    public totalSteps: number | undefined;
    public extraData: any;

    /**
     * PIDs managed by the operation
     * 
     * @private
     * @type {Array<number>}
     * @memberof AtomicOperation
     */
    private pids: Array<number>;


    /**
     * Indicates whether the operation is currently executing
     * 
     * @type {boolean}
     * @memberof AtomicOperation
     */
    public running: boolean;


    /**
     * Indicates whether the operation should override the scheduler and run regardless of its position in the queue
     * 
     * @type {boolean}
     * @memberof AtomicOperation
     */
    public ignoreScheduler: boolean;


    public constructor(data: InputData) {
        this.generatedArtifacts = new Array<string>();
        this.destinationArtifacts = new Array<string>();
        this.generatedArtifactsDirectories = new Array<string>();
        this.destinationArtifactsDirectories = new Array<string>();

        this.closeLogOnFailure = true;
        this.closeLogOnSuccess = true;

        this.flags = new CompletionFlags();

        this.running = false;

        this.ignoreScheduler = false;

        this.pids = new Array<number>();

        this.opName = data.opName;
    }
    public getGeneratedArtifacts(): Array<string> {
        return this.generatedArtifacts;
    }
    public setGeneratedArtifacts(artifacts: Array<string>): void {
        this.generatedArtifacts = artifacts;
    }
    public getDestinationArtifacts(): Array<string> {
        return this.destinationArtifacts;
    }
    public setDestinationArtifacts(artifacts: Array<string>): void {
        this.destinationArtifacts = artifacts;
    }
    public getGeneratedArtifactsDirectories(): Array<string> {
        return this.generatedArtifactsDirectories;
    }
    public setGeneratedArtifactsDirectories(artifacts: Array<string>): void {
        this.generatedArtifactsDirectories = artifacts;
    }
    public getDestinationArtifactsDirectories(): Array<string> {
        return this.destinationArtifactsDirectories;
    }
    public setDestinationArtifactsDirectories(artifacts: Array<string>): void {
        this.destinationArtifactsDirectories = artifacts;
    }



    /**
     * Sets flags to indicate failure
     * 
     * @param {CompletionFlags} flags 
     * @memberof AtomicOperation
     */
    public setFailure(flags: CompletionFlags): void {
        flags.done = true;
        flags.success = false;
        flags.failure = true;
    }

    /**
     * Sets flags to indicate success
     * 
     * @param {CompletionFlags} flags 
     * @memberof AtomicOperation
     */
    public setSuccess(flags: CompletionFlags): void {
        flags.done = true;
        flags.success = true;
        flags.failure = false;
    }


    /**
     * Register a new PID with the operation
     * 
     * @param {number} pid 
     * @memberof AtomicOperation
     */
    public addPID(pid: number): void {
        this.pids.push(pid);
    }

    /**
     * Register a new PID with the operation. Detects if the operation is running in a fork 
     * and passes the registration through to the managing process
     * 
     * @param {number} pid 
     * @memberof AtomicOperation
     */
    public addPIDFromFork(pid: number): void {
        //running forked
        if (process.send) {
            process.send!(
                <AtomicOperationForkEvent>{
                    pid: pid
                }
            );
        }
        else
            this.addPID(pid);
    }

    /**
     * Returns all PIDs registered to this operation. All PIDs are not guaranteed to be active
     * 
     * @returns {Array<number>} 
     * @memberof AtomicOperation
     */
    public getPIDs(): Array<number> {
        return this.pids;
    }

    /**
     * Method called by the scheduler when first invoking the operation
     * 
     * @abstract
     * @memberof AtomicOperation
     */
    public abstract run(): void;

    /**
     * Abort the operation an error message
     * 
     * @param {string} msg 
     * @memberof AtomicOperation
     */
    public abortOperationWithMessage(msg: string): void {
        this.setFailure(this.flags);
        this.extraData = msg;
        this.update!();
    }

    /**
     * Write an object to the operation's log file
     * 
     * @param {*} obj 
     * @memberof AtomicOperation
     */
    public logObject(obj: any): void {
        logString(this.logRecord!, JSON.stringify(obj, undefined, 4));
    }
}

/**
 * Provides integrated logging to operations running in forked processes
 * 
 * @export
 * @class ForkLogger
 * @extends {AtomicOperation}
 */
export class ForkLogger extends AtomicOperation<any>
{
    public constructor() {
        super({
            opName : "forkLoger"
        });
    }

    public run() { }
}


/**
 * Forks target, passing data and piping stdout/stderr to console.
 * Calls cb on messages from the forked ChildProcess
 * 
 * @export
 * @param {string} target 
 * @param {*} data 
 * @param {(ev : any) => void} cb 
 * @returns {cp.ChildProcess} 
 */
export function makeFork(target: string, data: any, cb: (ev: any) => void): cp.ChildProcess {
    let res = cp.fork(
        getReadable(target), [], <cp.ForkOptions>{
            silent: true
        }
    );

    res.stdout.on("data", function (data: Buffer) {
        console.log(data.toString());
    });

    res.stderr.on("data", function (data: Buffer) {
        console.error(data.toString());
    });

    res.on("message", function (ev: any) {
        cb(ev);
    });

    res.on("exit", function (code: number) {
        console.log(`${target} exited with ${code}`);
    });

    setTimeout(
        function () {
            res.send(data);
        }, 10
    );

    return res;
}

/**
 * Disconnects IPC channel and triggers a process exit of retCode
 * 
 * @export
 * @param {number} retCode 
 */
export function exitFork(retCode: number, disconnect = true): void {
    if (disconnect)
        process.disconnect();
    process.exitCode = retCode;
}

/**
 * Registers traps for unhandled errors in the current process. Logs exception details and stack traces
 * using the provided logger
 * @export
 * @param {ForkLogger} [logger] 
 * @param {string} [progressMessage] 
 */
export function handleForkFailures(logger?: ForkLogger, progressMessage?: string) {
    let signalFailure = function (err: string) {
        let flags: CompletionFlags = new CompletionFlags();
        flags.done = true;
        flags.failure = true;
        flags.success = false;

        let failureObj = <AtomicOperationForkEvent>{
            update: true,
            flags: flags,
            data: err,
            progressMessage: progressMessage
        };
        if (logger !== undefined) {
            logger.logObject(failureObj);
            closeLog(logger.logRecord!, "failure");
            failureObj.logRecord = logger.logRecord;
        }

        process.send!(failureObj);
        exitFork(1);

    };
    (process as NodeJS.EventEmitter).on("uncaughtException", function (err: Error) {
        let errString = `Uncaught exception ${err}`;
        console.log(errString);
        if (logger !== undefined) {
            logger.logObject(err);
        }
        signalFailure(`${err.toString()} ${err.stack}`);
    });

    process.on("unhandledRejection", function (reason: Error) {
        let errString = `Unhandled rejection ${reason}`;
        console.log(errString);
        if (logger !== undefined) {
            logger.logObject(errString);
        }
        signalFailure(`${reason.toString()} ${reason.stack}`);
    });
}

/**
 * Flags indicating the state of a running operation
 * 
 * @export
 * @class CompletionFlags
 */
export class CompletionFlags {
    public done: boolean;
    public success: boolean;
    public failure: boolean;
    public constructor() {
        this.done = false;
        this.success = false;
        this.failure = false;
    }
}

export let operationsQueue: Array<AtomicOperation<any>> = new Array<AtomicOperation<any>>();

export let updates: EventEmitter = new EventEmitter();

/**
 * Destroy the current queue of operations
 * 
 * @export
 */
export function clearOperationsQueue() {
    operationsQueue = new Array<AtomicOperation<any>>();
}

/**
 * Delete all of an operation's generatedArtifacts
 * 
 * @export
 * @param {AtomicOperation} op 
 */
export function cleanGeneratedArtifacts(op: AtomicOperation<any>): void {
    for (let i = 0; i != op.generatedArtifacts.length; ++i) {
        try {
            fs.unlinkSync(op.generatedArtifacts[i]);
        }
        catch (err) {
            err;
        }
    }
    for (let i = 0; i != op.generatedArtifactsDirectories.length; ++i) {
        try {
            rimraf.sync(op.generatedArtifactsDirectories[i]);
        }
        catch (err) {
            err;
        }
    }
}

/**
 * Delete all of an operation's destinationArtifacts
 * 
 * @export
 * @param {AtomicOperation} op 
 */
export function cleanDestinationArtifacts(op: AtomicOperation<any>): void {
    for (let i = 0; i != op.destinationArtifacts.length; ++i) {
        try {
            fs.unlinkSync(op.destinationArtifacts[i]);
        }
        catch (err) {
            err;
        }
    }
    for (let i = 0; i != op.destinationArtifactsDirectories.length; ++i) {
        try {
            rimraf.sync(op.destinationArtifactsDirectories[i]);
        }
        catch (err) {
            err;
        }
    }
}
export let onComplete: (op: AtomicOperation<any>) => void | undefined;

/**
 * Register a function to be called upon completion of any operation
 * 
 * @export
 * @param {(op : AtomicOperation<any>) => void} func 
 */
export function setOnComplete(func: (op: AtomicOperation<any>) => void): void {
    onComplete = func;
}

export type AddOperationType = CheckForUpdateData | 
BLASTSegmentData |
ChangeTitleData |
CheckForUpdateData |
CopyCircularFigureData | 
DeleteCircularFigureData |
DockWindowData |
DownloadAndInstallUpdateData |
GenerateQCReportData | 
ImportFileIntoProjectData |
IndexFastaForBowtie2AlignmentData |
IndexFastaForHisat2AlignmentData |
IndexFastaForVisualizationData |
InputBamFileData |
InputFastaFileData |
InputFastqFileData |
InstallUpdateData |
LinkRefSeqToAlignmentData |
LoadCurrentlyOpenProjectData |
NewProjectData |
OpenLogViewerData |
OpenNoSamHeaderPromptData |
OpenPileupViewerData |
OpenProjectData |
RenderCoverageTrackForContigData |
RenderSNPTrackForContigData |
RunBowtie2AlignmentData |
RunHisat2AlignmentData |
SaveProjectData |
UnDockWindowData;

/**
 * Check the queue for spare capacity. Run up to maxRunning operations concurrently.
 * This method should be called on a timer to continuously update the queue and run operations
 * 
 * @export
 * @param {number} maxRunning 
 */
export function runOperations(maxRunning: number): void {
    for (let i = 0; i != operationsQueue.length; ++i) {
        if (operationsQueue[i].ignoreScheduler && !operationsQueue[i].running) {
            operationsQueue[i].running = true;
            operationsQueue[i].run();
        }
    }
    //console.log(operationsQueue);
    let currentRunning: number = 0;
    for (let i = 0; i != operationsQueue.length; ++i) {
        if (operationsQueue[i] !== undefined) {
            if (operationsQueue[i].running)
                currentRunning++;
            if (currentRunning >= maxRunning)
                break;
            if (!operationsQueue[i].running) {
                operationsQueue[i].running = true;
                currentRunning++;
                operationsQueue[i].run();
            }
        }
    }
    for (let i = operationsQueue.length - 1; i >= 0; --i) {
        if (operationsQueue[i].flags.done) {
            if (operationsQueue[i].flags.success || operationsQueue[i].flags.failure) {
                operationsQueue.splice(i, 1);
            }
        }
        if (operationsQueue[i] === undefined)
            operationsQueue.splice(i, 1);
    }
}

export let logRecordFile = getReadableAndWritable("logs/logRecords");

/**
 * Structure describing an operation log
 * 
 * @export
 * @class LogRecord
 */
export class LogRecord {
    name: string = "";
    description: string = "";
    status: string = "";
    runTime: number = 0;
    startEpoch: number = 0;
    endEpoch: number = 0;
    uuid: string = "";
}

/**
 * Returns the directory a given log is stored in
 * 
 * @export
 * @param {LogRecord} logRecord 
 * @returns {string} 
 */
export function getLogDirectory(logRecord: LogRecord): string {
    return getReadableAndWritable(`logs/${logRecord.uuid}`);
}

/**
 * Returns the give log's backing log file
 * 
 * @export
 * @param {LogRecord} logRecord 
 * @returns {string} 
 */
export function getLogFile(logRecord: LogRecord): string {
    return getReadableAndWritable(`logs/${logRecord.uuid}/log`);
}

/**
 * Opens a new log and returns a LogRecord describing it
 * 
 * @export
 * @param {string} name 
 * @param {string} description 
 * @returns {LogRecord} 
 */
export function openLog(name: string, description: string): LogRecord {
    const mkdirp = require("mkdirp");
    const uuidv4: () => string = require("uuid/v4");

    let uuid = uuidv4();


    let res: LogRecord = new LogRecord();
    res.name = name;
    res.description = description;
    res.startEpoch = Date.now();
    res.uuid = uuid;

    mkdirp.sync(getLogDirectory(res));
    fs.appendFileSync(getLogFile(res), "");
    return res;
}

/**
 * Closes a given log with status. Updates the endEpoch and runTime properties of logRecord
 * 
 * @export
 * @param {LogRecord} logRecord 
 * @param {string} status 
 */
export function closeLog(logRecord: LogRecord, status: string): void {
    if (!logRecord || !logRecord.uuid)
        throw new Error(`Failed to close log with status ${status} which does not exist`);
    logRecord.endEpoch = Date.now();
    logRecord.status = status;

    let start = new Date(logRecord.startEpoch);
    let end = new Date(logRecord.endEpoch);

    logRecord.runTime = Math.abs((<any>end) - (<any>start));

}

/**
 * Write a given LogRecord to the global LogRecord so it can be retrievable later
 * 
 * @export
 * @param {LogRecord} record 
 */
export function recordLogRecord(record: LogRecord): void {
    const mkdirp = require("mkdirp");

    if (record === undefined)
        throw new Error("Cannot close log with record which does not exist");
    mkdirp.sync(getReadableAndWritable("logs"));
    fs.appendFileSync(logRecordFile, JSON.stringify(record) + "\n");
}

/**
 * Write a string to the given log
 * 
 * @export
 * @param {LogRecord} logRecord 
 * @param {string} data 
 */
export function logString(logRecord: LogRecord, data: string): void {
    if (!logRecord || !logRecord.uuid)
        throw new Error("Cannot write string to log which does not exist");

    fs.appendFileSync(getLogFile(logRecord), `${"\n"}${data}`);

}

/**
 * Returns a promise containing the last most recent logs written to the global LogRecord
 * 
 * @export
 * @param {number} last 
 * @returns {Promise<Array<LogRecord>>} 
 */
export async function getLogRecords(last: number): Promise<Array<LogRecord>> {
    return new Promise<Array<LogRecord>>((resolve, reject) => {
        let lines: Array<string> = new Array<string>();
        let res: Array<LogRecord> = new Array<LogRecord>();
        try {
            let rl: readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
                input: fs.createReadStream(logRecordFile)
            });
            rl.on("line", function (line: string) {
                lines.push(line);
            });
            rl.on("close", function () {
                lines = lines.reverse();
                for (let i = 0; i != last; ++i) {
                    if (i == lines.length) {
                        return resolve(res);
                    }
                    res.push(JSON.parse(lines[i]));
                }
                resolve(res);
            });
        }
        catch (err) {
            err;
        }
    });
}

/**
 * Retrieve the full log for the given LogRecord
 *
 * @export
 * @param {LogRecord} logRecord
 * @returns {Promise<string>}
 */
export async function getLogContent(logRecord: LogRecord): Promise<string> {
    return new Promise<string>((resolve: (value: string) => void) => {
        let res = "";

        let rl: readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input: fs.createReadStream(
                    getReadableAndWritable(`logs/${logRecord.uuid}/log`)
                )
            }
        );

        rl.on("line", function (line: string) {
            res += line;
            res += "\n";
        });

        rl.on("close", function () {
            resolve(res);
        });
    });
}
