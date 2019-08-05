import * as winMgr from "./../../../req/main/winMgr";
import { Fasta } from '../../../req/fasta';
import { getKey } from '../../../req/main/dataMgr';

/**
 * Triggers indexing for visualization for every ref seq in the first input window
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function indexRefsForVisualization() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("indexing ref seqs for visualization");
            let input = winMgr.getFreeWebContents();
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            resolve();
            setTimeout(function(){
            let firstRef : Fasta = getKey("input","fastaInputs")[0];
            console.log(`${firstRef.uuid}IndexForVisualization`);
            input[0].executeJavaScript(`
            document.getElementsByClassName("${firstRef.uuid}IndexForVisualization")[0].click();
            `);
            },1500);
        },2500);
    });
}