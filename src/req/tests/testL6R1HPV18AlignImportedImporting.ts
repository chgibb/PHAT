import * as fs from "fs";

import * as atomic from "./../operations/atomicOperations";
import {Fasta} from "./../fasta";
import {InputBamFile} from "./../operations/InputBamFile";
import * as hpv18Ref from "./hpv18Ref";
import * as L6R1HPV18AlignImported from "./L6R1HPV18AlignImported";
import {getUnSortedBam,getSortedBam,getSortBamIndex,} from "./../alignData";
import {getLinkableRefSeqs} from "./../getLinkableRefSeqs";
export async function testL6R1HPV18AlignImportedImporting() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("inputBamFile",function(op : InputBamFile){
            if(op.flags.failure)
            {
                console.log(`Failed to input bam`);
                return reject();
            }
            else if(op.flags.success)
            {
                fs.accessSync(getUnSortedBam(op.alignData));
                fs.accessSync(getSortedBam(op.alignData));
                fs.accessSync(getSortBamIndex(op.alignData));

                if(op.alignData.flagStatReport.overallAlignmentRate == 0)
                    console.log(`${op.alignData.alias} has correct overall alignment rate`);
                else
                    return reject();
                if(op.alignData.idxStatsReport[0].mappedReads == 0)
                    console.log(`${op.alignData.alias} has correct number of mapped reads`);
                else
                    return reject();
                if(op.alignData.idxStatsReport[0].unMappedReads == 0)
                    console.log(`${op.alignData.alias} has correct number of unmapped reads`);
                else
                    return reject();

                let res = getLinkableRefSeqs(<Array<Fasta>>[hpv18Ref.get()],op.alignData);

                if(!res)
                {
                    console.log(`Failed to determine link status for ${op.alignData.alias}`);
                    return reject();
                }
                if(res[0].linkable == true && res[0].uuid == hpv18Ref.get().uuid)
                    console.log(`Successfully determined link status to HPV18 for ${op.alignData.alias}`);
                else
                {
                    console.log(`${op.alignData.alias} is not linkable to HPV18`);
                    return reject();
                }

                L6R1HPV18AlignImported.set(op.alignData);

                return resolve();
            }
        });
    });
}