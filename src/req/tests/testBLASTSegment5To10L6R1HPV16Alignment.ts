import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTReadResults,getBLASTFragmentResults} from "./../BLASTSegmentResult";

export async function testBLASTSegment5To10L6R1HPV16Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.on("BLASTSegment",async function(op : BLASTSegment){
            if(op.progressMessage)
            {
                console.log(op.progressMessage);
            }

            if(op.flags.failure)
            {
                console.log("failed to BLAST segment");
                return reject();
            }

            else if(op.flags.success)
            {
                let readResults = await getBLASTReadResults(op.blastSegmentResult,0,0);
                if(readResults.length == 0)
                    console.log(`BLAST segment has correct number of read results in whole file`);
                else
                    return reject();
                
                let fragmentResults = await getBLASTFragmentResults(op.blastSegmentResult);
                if(fragmentResults.length == 0)
                    console.log(`BLAST segment has correct number of fragment results`);
                else
                    return reject();

                return resolve();
            }
        });
    });
}