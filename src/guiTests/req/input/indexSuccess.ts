import * as atomicOp from "./../../../req/operations/atomicOperations";
import {IndexFastaForAlignment} from "./../../../req/operations/indexFastaForAlignment";

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
        atomicOp.updates.on("indexFastaForAlignment",function(op : IndexFastaForAlignment){
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