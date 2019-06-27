import * as winMgr from "../../../req/main/winMgr";
import * as dataMgr from "../../../req/main/dataMgr";
import {Fastq} from "../../../req/fastq";

/**
 * Selects the first two reads for alignment in the first align window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function clickAdvanceThree() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        setTimeout(async function()
        {
            console.log("clicking advance step 3");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }

            await align[0].executeJavaScript(`
            document.getElementById("next3").click();
            `);
            setTimeout(async function()
            {
                resolve();
            });
        },1000);
    });
}