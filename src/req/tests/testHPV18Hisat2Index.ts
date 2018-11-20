import * as atomic from "../operations/atomicOperations";
import {IndexFastaForHisat2Alignment} from "../operations/indexFastaForHisat2Alignment";
import * as hpv18Ref from "./hpv18Ref";
export async function testHPV18Hisat2Index() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("indexFastaForHisat2Alignment",function(op : IndexFastaForHisat2Alignment){
            if(op.flags.failure)
            {
                console.log(`Failed to index ${op.fasta.alias}`);
                return reject();
            }
            else if(op.flags.success)
            {
                if(hpv18Ref.get().indexed)
                    console.log(`${op.fasta.alias} was indexed`);
                else
                    return reject();
                if(hpv18Ref.get().contigs.length == 1)
                    console.log(`${op.fasta.alias} has correct number of contigs`);
                else
                    return reject();
                if(hpv18Ref.get().contigs[0].bp == 7857)
                    console.log(`${op.fasta.alias} has correct base pairs`);
                else
                    return reject();
                return resolve();
            }
        });
    });
}