import * as path from "path";

import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import Fastq from "./../../../req/fastq";
export async function inputL6R1Reads() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        setTimeout(function(){
            console.log("inputting L6R1 reads");
            let fastqs = new Array<Fastq>();
            fastqs.push(new Fastq(path.resolve(path.normalize("../testData/L6R1.R1.fastq"))));
            fastqs.push(new Fastq(path.resolve(path.normalize("../testData/L6R1.R2.fastq"))));
            dataMgr.setKey("input","fastqInputs",fastqs);
            winMgr.publishChangeForKey("input","fastqInputs");
            resolve();
        },500);
    });
}