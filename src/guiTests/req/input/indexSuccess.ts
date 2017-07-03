import * as winMgr from "./../../../req/main/winMgr";
import * as atomicOp from "./../../../req/operations/atomicOperations";
import {IndexFasta} from "./../../../req/operations/indexFasta";
export async function indexSuccess() : Promise<boolean>
{
    return new Promise<boolean>((resolve,reject) => {
        atomicOp.updates.on("indexFasta",function(op : IndexFasta){
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