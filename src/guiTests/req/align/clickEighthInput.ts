import * as winMgr from "../../../req/main/winMgr";
import * as dataMgr from "../../../req/main/dataMgr";
import {Fastq} from "../../../req/fastq";

/**
 * Selects the eighth input on the page
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function clickEighthInput() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        setTimeout(async function()
        {
            console.log("clicking fourth input");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }
            await align[0].executeJavaScript(`
            document.getElementsByTagName("input")[7].click();
            `);
            setTimeout(async function()
            {
                resolve();
            });
        },1000);
    });
}
