import * as fs from "fs";

import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {parseBowTie2AlignmentReport} from "./../../bowTie2AlignmentReportParser";

export function varScanMPileup2SNP(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.unBufferedData)
                {
                    if(params.stdout)
                    {
                        op.varScanMPileup2SNPStdOutStream.write(params.unBufferedData);
                        fs.writeFileSync("out",params.unBufferedData);
                    }
                    else if(params.stderr)
                    {
                        fs.writeFileSync("err",params.unBufferedData);
                    }
                }
                else if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                op.varScanMPileup2SNPStdOutStream.end();
                                resolve();
                            },500
                        );
                    }
                    else
                    {
                        reject(`Failed to predict SNPs for ${op.alignData.alias}`);
                    }
                }
            }
        }
        op.varScanMPileup2SNPJob = new Job(
            "java",
            <Array<string>>[
                "-jar",
                op.varScanExe,
                "mpileup2snp",
                `resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/pileup.mpileup`
            ],"",true,jobCallBack,{}
        );
        try
        {
            op.varScanMPileup2SNPJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
        op.varScanMPileup2SNPStdOutStream = fs.createWriteStream(`resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/snps.vcf`);
    });
}