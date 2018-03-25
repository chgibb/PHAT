import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData} from "./req/alignData";
import {BLASTSegmentResult,getArtifactDir,streamSamSegmentReads} from "./req/BLASTSegmentResult";
import {generateSamForSegment} from "./req/operations/BLASTSegment/generateSamForSegment";
import {getAvgSeqLengthFromBam} from "./req/operations/BLASTSegment/getAvgSeqLengthFromBam";

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

        logger.logObject(ev);
        process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
        return;
    }

    if(ev.run == true)
    {
        await generateSamForSegment(
            blastSegmentResult,
            align,
            logger,
            function(reads : number){
                progressMessage = `Total Reads Found: ${reads}`;
                update();
            }
        );

        await getAvgSeqLengthFromBam(
            blastSegmentResult,
            align,
            logger,
            function(read : number){
                progressMessage = `Calculating Average Sequence Length. Read: ${read}`;
                update();
            }
        );

        await streamSamSegmentReads(blastSegmentResult,function(read : string){
            console.log("read: "+read.split(/\s/g)[9]);
            console.log("size "+read.split(/\s/g)[9].length);
            console.log("trimmed "+read.split(/\s/g)[9].slice(blastSegmentResult.avgSeqLength));
            console.log("size "+read.split(/\s/g)[9].slice(blastSegmentResult.avgSeqLength));
            console.log("avg seq length "+blastSegmentResult.avgSeqLength);
        });


        flags.done = true;
        flags.success = true;
        update();
        atomic.exitFork(0);
    }
});