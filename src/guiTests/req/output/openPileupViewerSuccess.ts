import * as atomicOp from "./../../../req/operations/atomicOperations";
import {OpenPileupViewer} from "./../../../req/operations/OpenPileupViewer";

/**
 * Resolves when openPileupViewer completes successfully, crashes the process
 * with code 1 on failure
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openPileupViewerSucess() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomicOp.updates.once("openPileupViewer",function(op : OpenPileupViewer){
            if(op.flags.done && op.flags.failure)
            {
                console.log("Failed to open viewer");
                process.exit(1);
            }
            if(op.flags.done && op.flags.success)
            {
                console.log("succeeded opening viewer");
                setTimeout(function(){
                    return resolve();
                },500);
            }
        });
    });
}