import * as atomic from "../operations/atomicOperations";
import {RunHisat2Alignment} from "../operations/RunHisat2Alignment";
import * as L6R1HPV18Align from "./L6R1HPV18Align";

export async function testL6R1HPV18Hisat2Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("runHisat2Alignment",async function(op : RunHisat2Alignment){
            if(op.flags.failure)
            {
                console.log(`Failed to align`);
                console.log(await atomic.getLogContent(op.logRecord)); 
                return reject();
            }
            else if(op.flags.success)
            {
                if(op.alignData.summary.reads == 2689)
                    console.log(`${op.alignData.alias} has correct number of reads`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                if(op.alignData.summary.mates == 5378)
                    console.log(`${op.alignData.alias} has correct number of mates`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(op.alignData.summary.overallAlignmentRate == 0)
                    console.log(`${op.alignData.alias} has correct overall alignment rate`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                if(op.alignData.varScanSNPSummary.minVarFreq == 0.2)
                    console.log(`${op.alignData.alias} has correct minimum variable frequency`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                if(op.alignData.varScanSNPSummary.minCoverage == 8)
                    console.log(`${op.alignData.alias} has correct minimum coverage`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                if(op.alignData.varScanSNPSummary.minAvgQual == 15)
                    console.log(`${op.alignData.alias} has correct minimum average quality`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                if(op.alignData.varScanSNPSummary.pValueThresh == 0.01)
                    console.log(`${op.alignData.alias} has correct p-value threshold`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(op.alignData.varScanSNPSummary.SNPsReported == 0)
                    console.log(`${op.alignData.alias} has correct predicted SNPs`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(op.alignData.varScanSNPSummary.indelsReported == 0)
                    console.log(`${op.alignData.alias} has correct indels reported`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                if(op.alignData.idxStatsReport[0].mappedReads == 0)
                    console.log(`${op.alignData.alias} has correct number of mapped reads`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(op.alignData.idxStatsReport[0].unMappedReads == 0)
                    console.log(`${op.alignData.alias} has correct number of unmapped reads`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                L6R1HPV18Align.set(op.alignData);

                return resolve();

            }
        });
    });
}