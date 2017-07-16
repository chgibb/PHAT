import * as path from "path";

import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import {Fasta} from "./../../../req/fasta";
export async function inputHPV16Ref() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("inputting hpv16 ref");
            let fastas = new Array<Fasta>();
            fastas.push(new Fasta(path.resolve(path.normalize("../testData/HPV16ref_genomes.fasta"))));
            dataMgr.setKey("input","fastaInputs",fastas);
            winMgr.publishChangeForKey("input","fastaInputs");
            resolve();
        },500);
    });
}