/// <reference path="./../node_modules/@chgibb/unmappedcigarfragments/lib/lib" />
import {SAMRead} from "./../node_modules/@chgibb/unmappedcigarfragments/lib/lib";
import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData, getSam} from "./req/alignData";
import {BLASTSegmentResult,getArtifactDir,getSamSegment,getBLASTReadResultsDir} from "./req/BLASTSegmentResult";
import {getReadsWithLargeUnMappedFragments} from "./req/operations/BLASTSegment/getReadsWithLargeUnMappedFragments";
import {BlastOutputRawJSON} from "./req/operations/BLASTSegment/BLASTOutput";
import {performQuery} from "./req/operations/BLASTSegment/BLASTRequest";

const mkdirp = require("mkdirp");

let flags : CompletionFlags = new CompletionFlags();
let align : AlignData;
let blastSegmentResult : BLASTSegmentResult;
let progressMessage = "";

let logger : atomic.ForkLogger = new atomic.ForkLogger();
atomic.handleForkFailures(logger);

function update() : void
{
    let update = <AtomicOperationForkEvent>{
        update : true,
        flags : flags,
        progressMessage : progressMessage,
        data : {
            blastSegmentResult : blastSegmentResult
        }
    };

    if(flags.done)
    {
        if(flags.success)
        {
            atomic.closeLog(logger.logRecord,"success");
            update.logRecord = logger.logRecord;
        }
        else if(flags.failure)
        {   
            atomic.closeLog(logger.logRecord,"failure");
            update.logRecord = logger.logRecord;
        }
    }

    logger.logObject(update);
    process.send(update);
}

process.on("message",async function(ev : AtomicOperationForkEvent){
    if(ev.setData == true)
    {
        logger.logRecord = atomic.openLog(ev.name,ev.description);
        
        align = ev.data.align;
        blastSegmentResult = ev.data.blastSegmentResult;

        mkdirp.sync(getArtifactDir(blastSegmentResult));
        mkdirp.sync(getBLASTReadResultsDir(blastSegmentResult));

        logger.logObject(ev);
        process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
        return;
    }

    if(ev.run == true)
    {

        let readsWithFragments : Array<SAMRead> = await getReadsWithLargeUnMappedFragments(
            getSam(align),
            blastSegmentResult.start,
            blastSegmentResult.stop
        );

        let res = await performQuery(readsWithFragments[0]);
        console.log(res);

        flags.done = true;
        flags.success = true;
        update();
        atomic.exitFork(0);
    }
});