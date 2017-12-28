import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import Fastq from "./../../../req/fastq";

/**
 * Selects the first two reads for alignment in the first align window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function selectFirstTwoReads() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("selecting first two reads");
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
            align[0].executeJavaScript(`
                document.getElementById("${fastqs[0].uuid}").click();
                document.getElementById("${fastqs[1].uuid}").click();
            `);
            resolve();
        },500);
    });
}