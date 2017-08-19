import * as atomicOp from "./../../../req/operations/atomicOperations";
import {IndexFastaForAlignment} from "./../../../req/operations/indexFasta";
export async function indexSuccess() : Promise<boolean>
{
    return new Promise<boolean>((resolve,reject) => {
        atomicOp.updates.on("indexFastaForAlignment",function(op : IndexFastaForAlignment){
            if(op.flags.done && op.flags.failure)
            {
                console.log("Failed to index");
                process.exit(1);
            }
            if(op.flags.done && op.flags.success)
            {
                console.log("succeeded indexing");
                resolve(true);
            }
        });
    });
}