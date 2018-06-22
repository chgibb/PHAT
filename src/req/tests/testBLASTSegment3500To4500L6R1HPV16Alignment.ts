import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTReadResults,getBLASTFragmentResults} from "./../BLASTSegmentResult";

export async function testBLASTSegment3500To4500L6R1HPV16Alignment() : Promise<void>
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
                if(results.length == 1)
                    console.log(`BLAST segment has correct number of results in whole file`);
                else
                    return reject();
                
                results = await getBLASTReadResults(op.blastSegmentResult,3500,4500);
                if(results.length == 1)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();
                
                results = await getBLASTReadResults(op.blastSegmentResult,1001,3000);
                if(results.length == 0)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();
                
                let fragmentResults = await getBLASTFragmentResults(op.blastSegmentResult);
                
                if(fragmentResults.length == 1)
                    console.log(`BLAST segment has correct number of fragments`);
                else
                    return reject();
                
                if(fragmentResults[0].seq == "AGATCGGAAGAGCACA")
                    console.log(`First fragment has correct sequence`);
                else 
                    return reject();
                
                if(fragmentResults[0].results.noHits == true)
                    console.log(`First fragment has correct results`);
                else
                    return reject();

                return resolve();
            }
        });
    });
}