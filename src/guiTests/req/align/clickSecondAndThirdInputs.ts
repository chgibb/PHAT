import * as winMgr from "../../../req/main/winMgr";
import * as dataMgr from "../../../req/main/dataMgr";
import {Fastq} from "../../../req/fastq";

/**
 * Selects the second and third inputs on the page
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function clickSecondAndThirdInputs() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        setTimeout(async function()
        {
            console.log("clicking second and third inputs");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }
            let fastqs : Array<Fastq> = dataMgr.getKey("input","fastqInputs");
            if(!fastqs)
            {
                console.log("failed to input reads");
                process.exit(1);
            }
            await align[0].executeJavaScript(`
            document.getElementsByTagName("input")[1].click();
            document.getElementsByTagName("input")[2].click()
            `);
            setTimeout(async function()
            {
                resolve();
            });
        },1000);
    });
}