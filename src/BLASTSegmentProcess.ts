import * as fs from "fs";

import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData, getSam} from "./req/alignData";
import {BLASTSegmentResult,getArtifactDir,getBLASTReadResultsStore,BLASTReadResult,BLASTFragmentResult,getBLASTFragmentResultsStore} from "./req/BLASTSegmentResult";
import {getReadWithFragments} from "./req/getReadWithFragments";
import {ReadWithFragments} from "./req/readWithFragments";
import {BLASTOutputRawJSON} from "./req/BLASTOutput";
import {performQuery,QueryStatus,BLASTDatabase} from "./req/BLASTRequest";
import {BLASTLENGTHCUTOFF} from "./req/BLASTLengthCutoff";

const mkdirp = require("mkdirp");

let flags : CompletionFlags = new CompletionFlags();
let align : AlignData;
let blastSegmentResult : BLASTSegmentResult;
let progressMessage = "";

let logger : atomic.ForkLogger = new atomic.ForkLogger();
atomic.handleForkFailures(logger);

function update(updateLog = true) : void
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
            atomic.closeLog(logger.logRecord!,"success");
            update.logRecord = logger.logRecord;
        }
        else if(flags.failure)
        {   
            atomic.closeLog(logger.logRecord!,"failure");
            update.logRecord = logger.logRecord;
        }
    }

    process.send!(update);
    if(updateLog)
        logger.logObject(update);
}

process.on("message",async function(ev : AtomicOperationForkEvent)
{
    if(ev.setData == true)
    {
        logger.logRecord = atomic.openLog(ev.name!,ev.description!);
        
        align = ev.data.align;
        blastSegmentResult = ev.data.blastSegmentResult;

        mkdirp.sync(getArtifactDir(blastSegmentResult));

        logger.logObject(ev);
        process.send!(<AtomicOperationForkEvent>{finishedSettingData : true});
        return;
    }

    if(ev.run == true)
    {
        progressMessage = `Searching for fragments in reads that aligned starting between ${blastSegmentResult.start} and ${blastSegmentResult.stop}`;
        update();
        let readsWithFragments : Array<ReadWithFragments> = await getReadWithFragments(
            getSam(align),
            blastSegmentResult.start!,
            blastSegmentResult.stop!,
            function()
            {}
        );

        logger.logObject({message: `Found ${readsWithFragments.length} reads`});

        let readsBLASTed = 0;

        for(let i = 0; i != readsWithFragments.length; ++i)
        {
            if(readsWithFragments[i].read.SEQ.length < BLASTLENGTHCUTOFF)
            {
                logger.logObject({message: `Read ${i} is too small`});
                continue;
            }

            let hasLargeFragment = false;
            for(let j = 0; j != readsWithFragments[i].fragments.length; ++ j)
            {
                if(readsWithFragments[i].fragments[j].type == "unmapped" && readsWithFragments[i].fragments[j].seq.length >= BLASTLENGTHCUTOFF)
                {
                    hasLargeFragment = true;
                    break;
                }
            }
            if(!hasLargeFragment)
            {
                logger.logObject({message: `Read ${i} does not have an unmapped fragment of sufficient size`});
                continue;
            }

            //BLAST identified reads
            let repeatedSearching = 0;
            progressMessage = `BLASTing suspicious read ${i+1} of ${readsWithFragments.length}: submitting query`;
            update();
            let res : BLASTOutputRawJSON = await performQuery(readsWithFragments[i].read.SEQ,BLASTDatabase.nt,function(status : QueryStatus)
            {
                if(status == "searching")
                    repeatedSearching++;
                progressMessage = `BLASTing suspicious read ${i+1} of ${readsWithFragments.length}: ${status} ${status == "searching" ? `x${repeatedSearching}` : ""}`;
                update();
            });

            readsBLASTed++;

            let readResult : BLASTReadResult = new BLASTReadResult(res,readsWithFragments[i]);
            progressMessage = `BLASTing suspicious read ${i+1} of ${readsWithFragments.length}: writing result`;
            update();
            fs.appendFileSync(getBLASTReadResultsStore(blastSegmentResult),JSON.stringify(readResult)+"\n");

            //BLAST identified large, unmapped fragments in each read
            for(let k = 0; k != readsWithFragments[i].fragments.length; ++k)
            {
                if(readsWithFragments[i].fragments[k].type != "unmapped" || readsWithFragments[i].fragments[k].seq.length < BLASTLENGTHCUTOFF)
                    continue;
                let repeatedSearching = 0;
                progressMessage = `BLASTING suspicious fragment ${k+1} of read ${i+1}: submitting query`;
                update();

                let res : BLASTOutputRawJSON = await performQuery(readsWithFragments[i].fragments[k].seq,BLASTDatabase.nt,function(status : QueryStatus)
                {
                    if(status == "searching")
                        repeatedSearching++;
                    progressMessage = `BLASTING suspicious fragment ${k+1} of read ${i+1}: ${status} ${status == "searching" ? `x${repeatedSearching}` : ""}`;
                    update();
                });

                if(res.noHits == true)
                {
                    repeatedSearching = 1;
                    res = await performQuery(readsWithFragments[i].fragments[k].seq,BLASTDatabase.Human,function(status : QueryStatus)
                    {
                        if(status == "searching")
                            repeatedSearching++;
                        progressMessage = `Re-BLASTING suspicious fragment ${k+1} of read ${i+1} against human genomic + transcript: ${status} ${status == "searching" ? `x${repeatedSearching}` : ""}`;
                        update();
                    });
                }

                progressMessage = `BLASTING suspicious fragment ${k+1} of read ${i+1}: writing result`;
                let fragmentResults : BLASTFragmentResult = new BLASTFragmentResult(res,readsWithFragments[i].fragments[k].seq,readResult.uuid);
                update();
                fs.appendFileSync(getBLASTFragmentResultsStore(blastSegmentResult),JSON.stringify(fragmentResults)+"\n");
            }
        }

        blastSegmentResult.readsBLASTed = readsBLASTed;

        flags.done = true;
        flags.success = true;
        update();
        setTimeout(function()
        {
            atomic.exitFork(0);
        },1000);
    }
});