import * as winMgr from "../../../req/main/winMgr";
import * as dataMgr from "../../../req/main/dataMgr";
import {Fastq} from "../../../req/fastq";

/**
 * Clicks the Bowtie2 radio option on the alignment form
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function clickBowtie2Radio() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        setTimeout(async function()
        {
            console.log("clicking bowtie2 radio");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }

            await align[0].executeJavaScript(`
            document.getElementById("bowtie2Radio").click();
            `);
            setTimeout(async function()
            {
                resolve();
            });
        },1000);
    });
}