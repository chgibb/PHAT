import * as winMgr from "../../../req/main/winMgr";
import * as dataMgr from "../../../req/main/dataMgr";
import {Fastq} from "../../../req/fastq";

/**
 * Clicks the second advance button on a form
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function clickAdvanceTwo() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        setTimeout(async function()
        {
            console.log("clicking advance step 2");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }

            await align[0].executeJavaScript(`
            document.getElementById("next2").click();
            `);
            setTimeout(async function()
            {
                resolve();
            });
        },1000);
    });
}