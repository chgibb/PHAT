import * as atomicOp from "./../../../req/operations/atomicOperations";
import {IndexFastaForBowTie2Alignment} from "../../../req/operations/indexFastaForBowTie2Alignment";

/**
 * Resolves when indexFastaAlignment completes successfully, crashes the process
 * with code 1 on failure
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function indexSuccess() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomicOp.updates.on("indexFastaForBowTie2Alignment",function(op : IndexFastaForBowTie2Alignment){
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