import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import {Fasta} from "./../../../req/fasta";

/**
 * Selects the first ref seq for alignment in the first align window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function selectFirstRef() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {
        setTimeout(async function(){
            console.log("selecting first ref seq");
            let align = winMgr.getFreeWebContents();
            if(!align || align.length == 0)
            {
                console.log("Failed to open align window");
                process.exit(1);
            }
            let fasta : Fasta = dataMgr.getKey("input","fastaInputs")[0];
            if(!fasta)
            {
                console.log("failed to input ref seq");
                process.exit(1);
            }
            await align[0].executeJavaScript(`
                document.getElementById("${fasta.uuid}").click();
            `);
            resolve();
        },1000);
    });
}