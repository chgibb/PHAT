import {RunBowtie2Alignment} from "../../../req/operations/RunBowtie2Alignment";

import * as atomicOp from "./../../../req/operations/atomicOperations";

/**
 * Resolves when runBowtie2Alignment completes successfully, crashes the process 
 * with code 1 on failure
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function alignSuccess() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        atomicOp.updates.on("runBowtie2Alignment",function(op : RunBowtie2Alignment)
        {
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