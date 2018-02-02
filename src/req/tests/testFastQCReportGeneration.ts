import * as atomic from "./../operations/atomicOperations";
import {GenerateQCReport} from "./../operations/GenerateQCReport";
import * as L6R1R1 from "./L6R1R1";
import * as L6R1R2 from "./L6R1R2";

export async function testFastQCReportGeneration() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {

        atomic.updates.removeAllListeners().on(
            "generateFastQCReport",function(op : GenerateQCReport)
            {
                if(op.flags.failure)
                {
                    return reject();
                }
                else if(op.flags.success)
                {
                    console.log(`Generated FastQC report for ${op.fastq.alias}`);
                    return resolve();
                }
            }
        );
    });
}