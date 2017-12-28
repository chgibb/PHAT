import * as atomicOp from "./../../../req/operations/atomicOperations";
import {RunAlignment} from "./../../../req/operations/RunAlignment";

/**
 * Resolves when runAlignment completes successfully, crashes the process 
 * with code 1 on failure
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function alignSuccess() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomicOp.updates.on("runAlignment",function(op : RunAlignment){
            if(op.flags.done && op.flags.failure)
            {
                console.log("Failed to align");
                process.exit(1);
            }
            if(op.flags.done && op.flags.success)
            {
                console.log("succeeded aligning");
                resolve();
            }
        });
    });
}