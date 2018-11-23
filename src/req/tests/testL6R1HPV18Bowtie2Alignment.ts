import * as fs from "fs";

import * as atomic from "../operations/atomicOperations";
import {RunBowtie2Alignment} from "../operations/RunBowtie2Alignment";
import * as L6R1HPV18Align from "./L6R1HPV18Align";
import * as HPV18Ref from "./hpv18Ref";
import {getCoverageForContig} from '../alignData';

export async function testL6R1HPV18Bowtie2Alignment() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.updates.removeAllListeners().on("runBowtie2Alignment",function(op : RunBowtie2Alignment){
            if(op.flags.failure)
            {
                console.log(`Failed to align`);
                return reject();
            }
            else if(op.flags.success)
            {
                if(op.alignData.summary.reads == 2689)
                    console.log(`${op.alignData.alias} has correct number of reads`);
                else
                    return reject();

                if(op.alignData.summary.mates == 5376)
                    console.log(`${op.alignData.alias} has correct number of mates`);
                else
                    return reject();
                
                if(op.alignData.summary.overallAlignmentRate == 0.04)
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
                
                if(op.alignData.varScanSNPSummary.SNPsReported == 0)
                    console.log(`${op.alignData.alias} has correct predicted SNPs`);
                else
                    return reject();
                
                if(op.alignData.varScanSNPSummary.indelsReported == 0)
                    console.log(`${op.alignData.alias} has correct indels reported`);
                else
                    return reject();

                if(op.alignData.idxStatsReport[0].mappedReads == 2)
                    console.log(`${op.alignData.alias} has correct number of mapped reads`);
                else
                    return reject();
                
                if(op.alignData.idxStatsReport[0].unMappedReads == 0)
                    console.log(`${op.alignData.alias} has correct number of unmapped reads`);
                else
                    return reject();

                if(fs.existsSync(getCoverageForContig(op.alignData,HPV18Ref.get().contigs[0].uuid)))
                    console.log(`${op.alignData.alias} coverage depth wrote succesffully`);
                else
                    return reject();

                L6R1HPV18Align.set(op.alignData);

                return resolve();

            }
        });
    });
}