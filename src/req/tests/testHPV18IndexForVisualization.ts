import * as fs from "fs";

import * as atomic from "./../operations/atomicOperations";
import {IndexFastaForVisualization} from "./../operations/indexFastaForVisualization";
import {get2BitPath} from "./../fasta";
import * as hpv18Ref from "./hpv18Ref";
export async function testHPV18IndexForVisualization() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("indexFastaForVisualization",function(op : IndexFastaForVisualization){
            if(op.flags.failure)
            {
                console.log(`Failed to index ${op.fasta.alias} for visualization`);
                return reject();
            }
            else if(op.flags.success)
            {
                if(hpv18Ref.get().indexedForVisualization)
                    console.log(`${op.fasta.alias} was indexed for visualization`);
                else
                    return reject();
                
                try
                {
                    fs.accessSync(get2BitPath(hpv18Ref.get()));
                    console.log(`Successfully accessed 2bit archive for hpv18 ref`);
                }
                catch(err)
                {
                    console.log(`Failed to access 2bit archive for hpv18 ref`);
                    return reject();
                }

                return resolve();
            }
        });
    });
}