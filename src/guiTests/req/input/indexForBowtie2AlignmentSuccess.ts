import * as atomicOp from "../../../req/operations/atomicOperations";
import {IndexFastaForBowtie2Alignment} from "../../../req/operations/indexFastaForBowtie2Alignment";

/**
 * Resolves when indexFastaAlignment completes successfully, crashes the process
 * with code 1 on failure
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function indexForBowtie2AlignmentSuccess() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomicOp.updates.on("indexFastaForBowtie2Alignment",function(op : IndexFastaForBowtie2Alignment){
            if(op.flags.done && op.flags.failure)
            {
                console.log("Failed to index");
                return reject();
            }
            if(op.flags.done && op.flags.success)
            {
                console.log("succeeded indexing");
                return resolve();
            }
        });
    });
}