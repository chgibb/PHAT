import * as fs from "fs";

import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {AlignData,getMPileup,getSNPsVCF,getSNPsJSON} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {varScanMPileup2SNPReportParser} from "./../../varScanMPileup2SNPReportParser";
import {varScanMPileup2SNPVCF2JSON} from "./../../varScanMPileup2SNPVCF2JSON";

export function varScanMPileup2SNP(alignData : AlignData,logger : atomic.AtomicOperation) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let varScanExe = getReadable("varscan.jar");

        let varScanMPileup2SNPStdOutStream : fs.WriteStream = fs.createWriteStream(getSNPsVCF(alignData));

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.unBufferedData)
                {
                    if(params.stdout)
                    {
                        varScanMPileup2SNPStdOutStream.write(params.unBufferedData);
                    }
                    else if(params.stderr)
                    {
                        alignData.varScanSNPReport += params.unBufferedData;
                    }
                }
                else if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                varScanMPileup2SNPStdOutStream.end();
                                alignData.varScanSNPSummary = varScanMPileup2SNPReportParser(alignData.varScanSNPReport);
                                fs.writeFileSync(
                                    getSNPsJSON(alignData),
                                    JSON.stringify(
                                        varScanMPileup2SNPVCF2JSON(
                                            fs.readFileSync(
                                                getSNPsVCF(alignData)
                                            ).toString()
                                        ),undefined,4
                                    )
                                );
                                resolve();
                            },500
                        );
                    }
                    else
                    {
                        reject(`Failed to predict SNPs for ${alignData.alias}`);
                    }
                }
            }
        }
        let varScanMPileup2SNPJob = new Job(
            "java",
            <Array<string>>[
                "-jar",
                varScanExe,
                "mpileup2snp",
                getMPileup(alignData)
            ],"",true,jobCallBack,{}
        );
        try
        {
            varScanMPileup2SNPJob.Run();
            logger.addPIDFromFork(varScanMPileup2SNPJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}