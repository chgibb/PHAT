import * as path from "path";

import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import {Fasta} from "./../../../req/fasta";

/**
 * Inputs HPV16 ref from test data directly by overwriting fastaInputs
 * 
 * @export
 * @returns {Promise<void>} 
 */
export async function inputHPV16Ref() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {
        setTimeout(async function(){
            console.log("inputting hpv16 ref");
            let fastas = new Array<Fasta>();
            fastas.push(new Fasta(path.resolve(path.normalize("../testData/HPV16ref_genomes.fasta"))));
            fastas[0].checked = true;
            dataMgr.setKey("input","fastaInputs",fastas);
            winMgr.publishChangeForKey("input","fastaInputs");
            setTimeout(async function(){
                resolve();
            },1500);
        },1500);
    });
}