import * as atomic from "./../operations/atomicOperations";
import {BLASTSegment} from "./../operations/BLASTSegment";
import * as L6R1HPV16Align from "./L6R1HPV16Align";

export async function testBLASTSegment0To1000L6R1HPV16Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.on("BLASTSegment",function(op : BLASTSegment){
            if(op.flags.failure)
            {
                console.log("failed to BLAST segment");
                return reject();
            }

            else if(op.flags.success)
            {
                if(op.blastSegmentResult.reads == 70)
                    console.log(`BLAST result has correct number of reads`);
                else
                    return reject();

                return resolve();
            }
        });
    });
}