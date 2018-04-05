import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTResults} from "./../BLASTSegmentResult";
import * as L6R7HPV16Align from "./L6R7HPV16Align";

export async function testBLASTSegment5To10L6R7HPV16Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.on("BLASTSegment",async function(op : BLASTSegment){
            if(op.progressMessage)
                console.log(op.progressMessage);

            if(op.flags.failure)
            {
                console.log("failed to BLAST segment");
                return reject();
            }

            else if(op.flags.success)
            {
                let results = await getBLASTResults(op.blastSegmentResult,0,0);
                if(results.length == 1)
                    console.log(`BLAST segment has correct number of results in whole file`);
                else
                    return reject();
                
                results = await getBLASTResults(op.blastSegmentResult,5,10);
                if(results.length == 1)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();
                
                results = await getBLASTResults(op.blastSegmentResult,11,100);
                if(results.length == 0)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();

                return resolve();
            }
        });
    });
}