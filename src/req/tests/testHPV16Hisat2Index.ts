import * as atomic from "../operations/atomicOperations";
import {IndexFastaForBowtie2Alignment} from "../operations/indexFastaForBowtie2Alignment";
import * as hpv16Ref from "./hpv16Ref";
export async function testHPV16Hisat2Index() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("indexFastaForBowtie2Alignment",function(op : IndexFastaForBowtie2Alignment){
            if(op.flags.failure)
            {
                console.log(`Failed to index ${op.fasta.alias}`);
                return reject();
            }
            else if(op.flags.success)
            {
                if(hpv16Ref.get().indexed)
                    console.log(`${op.fasta.alias} was indexed`);
                else
                    return reject();
                if(hpv16Ref.get().contigs.length == 1)
                    console.log(`${op.fasta.alias} has correct number of contigs`);
                else
                    return reject();
                if(hpv16Ref.get().contigs[0].bp == 7906)
                    console.log(`${op.fasta.alias} has correct base pairs`);
                else
                    return reject();
                return resolve();
            }
        });
    });
}