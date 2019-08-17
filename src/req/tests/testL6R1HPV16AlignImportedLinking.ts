import * as fs from "fs";

import * as atomic from "./../operations/atomicOperations";
import {Fasta} from "./../fasta";
import {LinkRefSeqToAlignment} from "./../operations/LinkRefSeqToAlignment";
import * as hpv16Ref from "./hpv16Ref";
import * as L6R1HPV16AlignImported from "./L6R1HPV16AlignImported";
import {getCoverage,getCoverageDir,getFlagStats,getMPileup,getSNPsJSON,getSNPsVCF} from "./../alignData";
export async function testL6R1HPV16AlignImportedLinking() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        atomic.updates.removeAllListeners().on("linkRefSeqToAlignment",async function(op : LinkRefSeqToAlignment)
        {
            if(op.flags.failure)
            {
                console.log("Failure to link bam");
                console.log(await atomic.getLogContent(op.logRecord!)); 
                return reject();
            }
            else if(op.flags.success)
            {
                fs.accessSync(getCoverage(op.alignData!));
                fs.accessSync(getCoverageDir(op.alignData!));
                fs.accessSync(getFlagStats(op.alignData!));
                fs.accessSync(getMPileup(op.alignData!));
                fs.accessSync(getSNPsJSON(op.alignData!));
                fs.accessSync(getSNPsVCF(op.alignData!));

                if(op.alignData!.varScanSNPSummary!.minVarFreq == 0.2)
                    console.log(`${op.alignData!.alias} has correct minimum variable frequency`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord!)); 
                    return reject();
                }

                if(op.alignData!.varScanSNPSummary!.minCoverage == 8)
                    console.log(`${op.alignData!.alias} has correct minimum coverage`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord!)); 
                    return reject();
                }

                if(op.alignData!.varScanSNPSummary!.minAvgQual == 15)
                    console.log(`${op.alignData!.alias} has correct minimum average quality`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord!)); 
                    return reject();
                }

                if(op.alignData!.varScanSNPSummary!.pValueThresh == 0.01)
                    console.log(`${op.alignData!.alias} has correct p-value threshold`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord!)); 
                    return reject();
                }
                
                if(op.alignData!.varScanSNPSummary!.SNPsReported == 11)
                    console.log(`${op.alignData!.alias} has correct predicted SNPs`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord!)); 
                    return reject();
                }
                
                if(op.alignData!.varScanSNPSummary!.indelsReported == 0)
                    console.log(`${op.alignData!.alias} has correct indels reported`);
                else
                {
                    console.log(await atomic.getLogContent(op.logRecord!)); 
                    return reject();
                }

                L6R1HPV16AlignImported.set(op.alignData!);

                return resolve();
            }
        });
    });
}