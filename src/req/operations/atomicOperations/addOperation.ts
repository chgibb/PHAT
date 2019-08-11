import {BLASTSegment} from "../BLASTSegment";
import {CheckForUpdate} from "../CheckForUpdate";
import {ChangeTitle} from "../ChangeTitle";
import {CopyCircularFigure} from "../CopyCircularFigure";
import {DeleteCircularFigure} from "../DeleteCircularFigure";
import {DockWindow} from "../DockWindow";
import {DownloadAndInstallUpdate} from "../DownloadAndInstallUpdate";
import {GenerateQCReport} from "../GenerateQCReport";
import {ImportFileIntoProject} from "../ImportFileIntoProject";
import {IndexFastaForBowtie2Alignment} from "../indexFastaForBowtie2Alignment";
import {IndexFastaForHisat2Alignment} from "../indexFastaForHisat2Alignment";
import {InputBamFile} from "../InputBamFile";
import {InputFastaFile} from "../inputFastaFile";
import {InputFastqFile} from "../inputFastqFile";
import {InstallUpdate} from "../InstallUpdate";
import {LinkRefSeqToAlignment} from "../LinkRefSeqToAlignment";
import {LoadCurrentlyOpenProject} from "../LoadCurrentlyOpenProject";
import {NewProject} from "../NewProject";
import {OpenLogViewer} from "../OpenLogViewer";
import {OpenNoSamHeaderPrompt} from "../OpenNoSamHeaderPrompt";
import {OpenPileupViewer} from "../OpenPileupViewer";
import {OpenProject} from "../OpenProject";
import {RenderCoverageTrackForContig} from "../RenderCoverageTrack";
import {RenderSNPTrackForContig} from "../RenderSNPTrack";
import {RunBowtie2Alignment} from "../RunBowtie2Alignment";
import {RunHisat2Alignment} from "../RunHisat2Alignment";
import {SaveProject} from "../SaveProject";
import {UnDockWindow} from "../UnDockWindow";
import {IndexFastaForVisualization} from "../indexFastaForVisualization";
import {AddOperationType, operationsQueue, AtomicOperation, cleanGeneratedArtifacts, cleanDestinationArtifacts, recordLogRecord, closeLog, onComplete, updates} from "../atomicOperations";

/**
 * Add a new operation given by opName onto the queue. data will be passed to the operation
 * prior to execution
 *
 * @export
 * @param {string} opName
 * @param {*} data
 * @returns {void}
 */
export function addOperation(data: AddOperationType): void 
{
    switch (data.opName) 
    {
    case "BLASTSegment":
        operationsQueue.push(new BLASTSegment({
            ...data
        }));
        break;
    case "changeTitle":
        operationsQueue.push(new ChangeTitle({
            ...data
        }));
        break;
    case "checkForUpdate":
        operationsQueue.push(new CheckForUpdate({
            ...data
        }));
        break;
    case "copyCircularFigure":
        operationsQueue.push(new CopyCircularFigure({
            ...data
        }));
        break;
    case "deleteCircularFigure":
        operationsQueue.push(new DeleteCircularFigure({
            ...data
        }));
        break;
    case "dockWindow":
        operationsQueue.push(new DockWindow({
            ...data
        }));
        break;
    case "downloadAndInstallUpdate":
        operationsQueue.push(new DownloadAndInstallUpdate({
            ...data
        }));
        break;
    case "generateQCReport":
        operationsQueue.push(new GenerateQCReport({
            ...data
        }));
        break;
    case "importFileIntoProject":
        operationsQueue.push(new ImportFileIntoProject({
            ...data
        }));
        break;
    case "indexFastaForBowtie2Alignment":
        operationsQueue.push(new IndexFastaForBowtie2Alignment({
            ...data
        }));
        break;
    case "indexFastaForHisat2Alignment":
        operationsQueue.push(new IndexFastaForHisat2Alignment({
            ...data
        }));
        break;
    case "indexFastaForVisualization":
        operationsQueue.push(new IndexFastaForVisualization({
            ...data
        }));
        break;
    case "inputBamFile":
        operationsQueue.push(new InputBamFile({
            ...data
        }));
        break;
    case "inputFastaFile":
        operationsQueue.push(new InputFastaFile({
            ...data
        }));
        break;
    case "inputFastqFile":
        operationsQueue.push(new InputFastqFile({
            ...data
        }));
        break;
    case "installUpdate":
        operationsQueue.push(new InstallUpdate({
            ...data
        }));
        break;
    case "linkRefSeqToAlignment":
        operationsQueue.push(new LinkRefSeqToAlignment({
            ...data
        }));
        break;
    case "loadCurrentlyOpenProject":
        operationsQueue.push(new LoadCurrentlyOpenProject({
            ...data
        }));
        break;
    case "newProject":
        operationsQueue.push(new NewProject({
            ...data
        }));
        break;
    case "openLogViewer":
        operationsQueue.push(new OpenLogViewer({
            ...data
        }));
        break;
    case "openNoSamHeaderPrompt":
        operationsQueue.push(new OpenNoSamHeaderPrompt({
            ...data
        }));
        break;
    case "openPileupViewer":
        operationsQueue.push(new OpenPileupViewer({
            ...data
        }));
        break;
    case "openProject":
        operationsQueue.push(new OpenProject({
            ...data
        }));
        break;
    case "renderCoverageTrackForContig":
        operationsQueue.push(new RenderCoverageTrackForContig({
            ...data
        }));
        break;
    case "renderSNPTrackForContig":
        operationsQueue.push(new RenderSNPTrackForContig({
            ...data
        }));
        break;
    case "runBowtie2Alignment":
        operationsQueue.push(new RunBowtie2Alignment({
            ...data
        }));
        break;
    case "runHisat2Alignment":
        operationsQueue.push(new RunHisat2Alignment({
            ...data
        }));
        break;
    case "saveProject":
        operationsQueue.push(new SaveProject({
            ...data
        }));
        break;
    case "unDockWindow":
        operationsQueue.push(new UnDockWindow({
            ...data
        }));
        break;
    default:
        (function (data: never) 
        {
            throw (data);
        })(data);
    }

    let op : AtomicOperation<any> | undefined = operationsQueue[operationsQueue.length - 1];
    if(op)
    {
        op.update = function()
        {
            if(op)
            {
                if(op.flags.done)
                {
                    cleanGeneratedArtifacts(op);
                    if(op.flags.failure)
                    {
                        op.logObject(op.extraData);
                        cleanDestinationArtifacts(op);
                        if(op.closeLogOnFailure)
                        {
                            closeLog(op.logRecord!,"failure");
                            recordLogRecord(op.logRecord!);
                        }
                    }
                    else if(op.flags.success)
                    {
                        if(op.closeLogOnSuccess)
                        {
                            closeLog(op.logRecord!,"success");
                            recordLogRecord(op.logRecord!);
                        }
                    }
                    if(onComplete)
                        onComplete(op);
                }
                updates.emit(op.opName,op);
            }
        };
    }
    /*
    for(let i = 0; i != registeredOperations.length; ++i)
    {
        if(registeredOperations[i].name == opName)
        {
            let op : AtomicOperation<any> = new (<any>(registeredOperations[i].op))();
            op.name = registeredOperations[i].name;
            op.setData(data);
            op.update = function()
            {
                if(op.flags.done)
                {
                    cleanGeneratedArtifacts(op);
                    if(op.flags.failure)
                    {
                        op.logObject(op.extraData);
                        cleanDestinationArtifacts(op);
                        if(op.closeLogOnFailure)
                        {
                            closeLog(op.logRecord!,"failure");
                            recordLogRecord(op.logRecord!);
                        }
                    }
                    else if(op.flags.success)
                    {
                        if(op.closeLogOnSuccess)
                        {
                            closeLog(op.logRecord!,"success");
                            recordLogRecord(op.logRecord!);
                        }
                    }
                    if(onComplete)
                        onComplete(op);
                }
                updates.emit(op.name!,op);
            };
            operationsQueue.push(op);
            return;
        }
    }
    console.log("Could not add operation "+opName);*/
}
