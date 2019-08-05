import * as atomicOp from "./../../../req/operations/atomicOperations";
import {IndexFastaForVisualization} from "./../../../req/operations/indexFastaForVisualization";

/**
 * Resolves when indexFastaForVisualization completes successfully, crashes the process
 * with code 1 on failure
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function indexForVisualizationSuccess() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        atomicOp.updates.on("indexFastaForVisualization",function(op : IndexFastaForVisualization)
        {
            if(op.flags.done && op.flags.failure)
            {
                console.log("Failed to index for visualization");
                process.exit(1);
            }
            if(op.flags.done && op.flags.success)
            {
                console.log("succeeded indexing for visualization");
                resolve();
            }
        });
    });
}