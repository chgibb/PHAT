import { getFreeWebContents } from '../../../req/main/winMgr';
import { getKey } from '../../../req/main/dataMgr';
import { AlignData } from '../../../req/alignData';

export async function clickPredictedSNPsButton() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("opening SNP table for first alignment");
            let output = getFreeWebContents();
            if(!output || output.length == 0)
            {
                console.log("failed to open output window");
                process.exit(1);
            }
            setTimeout(function()
            {
                let firstAlign : AlignData = getKey("align","aligns")[0];
                output[0].executeJavaScript(`
                    document.getElementById("predictedSnps").click();
                `);
                resolve();
            },500);
        },500);
    });
}