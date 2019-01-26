import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import {Fasta} from "./../../../req/fasta";

/**
 * Creates a new circular figure for HPV16 ref genomes
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function createHPV16Figure() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("creating new figure for hpv16 ref");
            
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
                        document.getElementById("${fastas[i].uuid}NewFigure").click();
                    `);
                    return resolve();
                }
            }
            return reject()
        },1000);
    });
}