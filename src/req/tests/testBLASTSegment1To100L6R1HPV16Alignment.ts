import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import {getBLASTReadResults,getBLASTFragmentResults} from "./../BLASTSegmentResult";

export async function testBLASTSegment1To100L6R1HPV16Alignment() : Promise<void>
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
                let readResults = await getBLASTReadResults(op.blastSegmentResult,0,0);
                if(readResults.length == 2)
                    console.log(`BLAST segment has correct number of results in whole file`);
                else
                    return reject();
                
                readResults = await getBLASTReadResults(op.blastSegmentResult,0,1000);
                if(readResults.length == 2)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();
                
                readResults = await getBLASTReadResults(op.blastSegmentResult,1001,3000);
                if(readResults.length == 0)
                    console.log(`BLAST segment has correct number of results in range`);
                else
                    return reject();

                let fragmentResults = await getBLASTFragmentResults(op.blastSegmentResult);
                
                if(fragmentResults.length == 2)
                    console.log(`BLAST segment has correct number of fragments`);
                else
                    return reject();
                
                if(fragmentResults[0].seq == "ACGCTCTTCCGATCT")
                    console.log(`First fragment has correct sequence`);
                else 
                    return reject();
                
                if(fragmentResults[0].results.noHits == true)
                    console.log(`First fragment has correct results`);
                else
                    return reject();

                if(fragmentResults[1].seq == "AATAATACTAAACTAC")
                    console.log(`Second fragment has correct sequence`);
                else 
                    return reject();
                
                if(fragmentResults[1].results.noHits == true)
                    console.log(`Second fragment has correct results`);
                else
                    return reject();

                return resolve();
            }
        });
    });
}