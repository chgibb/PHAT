import * as atomic from "./../operations/atomicOperations";
import {RunAlignment} from "./../operations/RunAlignment";
import * as L6R7R1 from "./L6R7R1";
import * as L6R7R2 from "./L6R7R2";
import * as L6R7HPV16Align from "./L6R7HPV16Align";
export async function testL6R7HPV16Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("runAlignment",function(op : RunAlignment){
            if(op.flags.failure)
            {
                console.log(`Failed to align`);
                return reject();
            }
            else if(op.flags.success)
            {
                if(op.alignData.summary.reads == 4327)
                    console.log(`${op.alignData.alias} has correct number of reads`);
                else
                    return reject();

                if(op.alignData.summary.mates == 1954)
                    console.log(`${op.alignData.alias} has correct number of mates`);
                else
                    return reject();
                
                if(op.alignData.summary.overallAlignmentRate == 77.62)
                    console.log(`${op.alignData.alias} has correct overall alignment rate`);
                else
                    return reject();

                if(op.alignData.varScanSNPSummary.minVarFreq == 0.2)
                    console.log(`${op.alignData.alias} has correct minimum variable frequency`);
                else
                    return reject();

                if(op.alignData.varScanSNPSummary.minCoverage == 8)
                    console.log(`${op.alignData.alias} has correct minimum coverage`);
                else
                    return reject();

                if(op.alignData.varScanSNPSummary.minAvgQual == 15)
                    console.log(`${op.alignData.alias} has correct minimum average quality`);
                else
                    return reject();

                if(op.alignData.varScanSNPSummary.pValueThresh == 0.01)
                    console.log(`${op.alignData.alias} has correct p-value threshold`);
                else
                    return reject();
                
                if(op.alignData.varScanSNPSummary.SNPsReported == 13)
                    console.log(`${op.alignData.alias} has correct predicted SNPs`);
                else
                    return reject();
                
                if(op.alignData.varScanSNPSummary.indelsReported == 0)
                    console.log(`${op.alignData.alias} has correct indels reported`);
                else
                    return reject();

                if(op.alignData.idxStatsReport[0].mappedReads == 6717)
                    console.log(`${op.alignData.alias} has correct number of mapped reads`);
                else
                    return reject();
                
                if(op.alignData.idxStatsReport[0].unMappedReads == 15)
                    console.log(`${op.alignData.alias} has correct number of unmapped reads`);
                else
                    return reject();

                L6R7HPV16Align.set(op.alignData);

                return resolve();
            }
        });
    });
}