import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import {Fasta} from "./../../../req/fasta";

/**
 * Expands HPV16 figure list
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function expandHPV16FigureList() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        setTimeout(function()
        {
            console.log("expanding figure list for hpv16");
            
            let genomeBuilder = winMgr.getFreeWebContents();
            if(!genomeBuilder || genomeBuilder.length == 0)
            {
                console.log("Failed to open genomeBuilder window");
                process.exit(1);
            }

            let fastas = new Array<Fasta>();
            fastas = dataMgr.getKey("input","fastaInputs");
            for(let i = 0; i != fastas.length; ++i)
            {
                if(fastas[i].alias == "HPV16ref_genomes.fasta")
                {
                    genomeBuilder[0].executeJavaScript(`
                        document.getElementById("${fastas[i].uuid}ExpandTree").children[0].click();
                    `);
                    return resolve();
                }
            }
            return reject();
        },1000);
    });
}