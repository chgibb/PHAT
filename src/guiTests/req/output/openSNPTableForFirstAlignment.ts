import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import {AlignData} from "./../../../req/alignData";

/**
 * Opens the SNP table for the first alignment in the first output window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function openSNPTableForFirstAlignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("opening SNP table for first alignment");
            let output = winMgr.getFreeWebContents();
            if(!output || output.length == 0)
            {
                console.log("failed to open output window");
                process.exit(1);
            }
            setTimeout(function()
            {
                let firstAlign : AlignData = dataMgr.getKey("align","aligns")[0];
                output[0].executeJavaScript(`
                    document.getElementById("${firstAlign.uuid}ViewSNPs").click();
                `);
                resolve();
            },500);
        },500);
    });
}