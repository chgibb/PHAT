import * as atomic from "../operations/atomicOperations";
import {IndexFastaForHisat2Alignment} from "../operations/indexFastaForHisat2Alignment";
import * as hpv16Ref from "./hpv16Ref";
export async function testHPV16Hisat2Index() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("indexFastaForHisat2Alignment",async function(op : IndexFastaForHisat2Alignment){
            if(op.flags.failure)
            {
                console.log(`Failed to index ${op.fasta.alias}`);
                console.log(await atomic.getLogContent(op.logRecord)); 
                return reject();
            }
            else if(op.flags.success)
            {
                if(hpv16Ref.get().indexed)
                    console.log(`${op.fasta.alias} was indexed`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                if(hpv16Ref.get().contigs.length == 1)
                    console.log(`${op.fasta.alias} has correct number of contigs`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                if(hpv16Ref.get().contigs[0].bp == 7906)
                    console.log(`${op.fasta.alias} has correct base pairs`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                return resolve();
            }
        });
    });
}