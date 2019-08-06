import * as atomic from "../operations/atomicOperations";
import {RunBowtie2Alignment} from "../operations/RunBowtie2Alignment";

import * as L6R7R1 from "./L6R7R1";
import * as L6R7R2 from "./L6R7R2";
import * as L6R7HPV16Align from "./L6R7HPV16Align";
export async function testL6R7HPV16Bowtie2Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        atomic.updates.removeAllListeners().on("runBowtie2Alignment",async function(op : RunBowtie2Alignment)
        {
            if(op.flags.failure)
            {
                console.log("Failed to align");
                console.log(await atomic.getLogContent(op.logRecord)); 
                return reject();
            }
            else if(op.flags.success)
            {
                if(op.alignData.summary.reads == 4327)
                    console.log(`${op.alignData.alias} has correct number of reads`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                if(op.alignData.summary.mates == 1954)
                    console.log(`${op.alignData.alias} has correct number of mates`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(op.alignData.summary.overallAlignmentRate == 77.62)
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
                
                if(op.alignData.varScanSNPSummary.SNPsReported == 13)
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

                if(op.alignData.idxStatsReport[0].mappedReads == 6717)
                    console.log(`${op.alignData.alias} has correct number of mapped reads`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }
                
                if(op.alignData.idxStatsReport[0].unMappedReads == 15)
                    console.log(`${op.alignData.alias} has correct number of unmapped reads`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord)); 
                    return reject();
                }

                L6R7HPV16Align.set(op.alignData);

                return resolve();
            }
        });
    });
}