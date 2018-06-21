import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTReadResults} from "./../BLASTSegmentResult";

export async function testBLASTSegment0To1000L6R1HPV16Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.on("BLASTSegment",async function(op : BLASTSegment){
            if(op.progressMessage)
            {
                if(!/Searching for fragments in read/g.test(op.progressMessage))
                {
                    console.log(op.progressMessage);
                }
            }

            if(op.flags.failure)
            {
                console.log("failed to BLAST segment");
                return reject();
            }

            else if(op.flags.success)
            {
                let results = await getBLASTReadResults(op.blastSegmentResult,0,0);
                if(results.length == 2)
                    console.log(`BLAST segment has correct number of results in whole file`);
                else
                    return reject();
                
                results = await getBLASTReadResults(op.blastSegmentResult,0,1000);
                if(results.length == 2)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();
                
                results = await getBLASTReadResults(op.blastSegmentResult,1001,3000);
                if(results.length == 0)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();

                return resolve();
            }
        });
    });
}