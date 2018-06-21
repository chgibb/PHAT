/// <reference path="./../node_modules/@chgibb/unmappedcigarfragments/lib/lib" />

import * as fs from "fs";

import {SAMRead} from "@chgibb/unmappedcigarfragments/lib/lib";

import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData, getSam} from "./req/alignData";
import {BLASTSegmentResult,getArtifactDir,getSamSegment,getBLASTReadResultsStore,BLASTReadResult} from "./req/BLASTSegmentResult";
import {getReadsWithLargeUnMappedFragments} from "./req/operations/BLASTSegment/getReadsWithLargeUnMappedFragments";
import {ReadWithFragments} from "./req/readWithFragments";
import {BLASTOutputRawJSON} from "./req/BLASTOutput";
import {performQuery,QueryStatus} from "./req/BLASTRequest";

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

    process.send(update);
    logger.logObject(update);
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

        let readsWithFragments : Array<ReadWithFragments> = await getReadsWithLargeUnMappedFragments(
            getSam(align),
            blastSegmentResult.start,
            blastSegmentResult.stop,
            function(parsedReads : number){
                progressMessage = `Searching for fragments in read ${parsedReads} that aligned starting between ${blastSegmentResult.start} and ${blastSegmentResult.stop}`;
                update();
            }
        );

        for(let i = 0; i != readsWithFragments.length; ++i)
        {
            let repeatedSearching = 0;
            progressMessage = `BLASTing suspicious read ${i+1} of ${readsWithFragments.length}: submitting query`;
            update();
            let res : BLASTOutputRawJSON = await performQuery(readsWithFragments[i].read,function(status : QueryStatus){
                if(status == "searching")
                    repeatedSearching++;
                progressMessage = `BLASTing suspicious read ${i+1} of ${readsWithFragments.length}: ${status} ${status == "searching" ? `x${repeatedSearching}` : ``}`;
                update();
            });

            let result : BLASTReadResult = new BLASTReadResult(res,readsWithFragments[i]);
            progressMessage = `BLASTing suspicious read ${i+1} of ${readsWithFragments.length}: writing result`;
            update();
            fs.appendFileSync(getBLASTReadResultsStore(blastSegmentResult),JSON.stringify(result)+"\n");
        }

        blastSegmentResult.readsBLASTed = readsWithFragments.length;

        flags.done = true;
        flags.success = true;
        update();
        setTimeout(function(){
            atomic.exitFork(0);
        },1000);
    }
});