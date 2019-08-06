import * as winMgr from "./../../../req/main/winMgr";
import {openPileupViewerSucess} from "./openPileupViewerSuccess";

/**
 * Trigger the pileup viewer to open to the nth SNP in the SNP table
 * open in the first output window. Crashes the process
 * with code 1 on failure
 * 
 * @export
 * @param {number} n 
 * @returns {Promise<void>} 
 */
export async function viewSNP(n : number) : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log(`opening pileup viewer for SNP ${n}`);
            let output = winMgr.getFreeWebContents();
            if(!output || output.length == 0)
            {
                console.log("failed to open output window");
                process.exit(1);
            }
            openPileupViewerSucess().then(() => 
            {
                return resolve();
            });
            output[0].executeJavaScript(`
                document.getElementById("viewSNP${n}").click();
            `);
        },500);
    });
}