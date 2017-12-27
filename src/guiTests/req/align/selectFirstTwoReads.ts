import * as winMgr from "./../../../req/main/winMgr";
import * as dataMgr from "./../../../req/main/dataMgr";
import {Fasta} from "./../../../req/fasta";
import Fastq from "./../../../req/fastq";
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
            let fasta : Fasta = dataMgr.getKey("input","fastaInputs")[0];
            if(!fastqs)
            {
                console.log("failed to input reads");
                process.exit(1);
            }
            if(!fasta)
            {
                console.log("failed to input ref seq");
                process.exit(1);
            }
            align[0].executeJavaScript(`
                document.getElementById("${fastqs[0].uuid}").click();
                document.getElementById("${fastqs[1].uuid}").click();
                document.getElementById("${fasta.uuid}").click();
            `);
            resolve();
        },500);
    });
}