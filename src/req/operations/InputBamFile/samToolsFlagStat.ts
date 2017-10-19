import * as fs from "fs";

import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {AlignData,getSortedBam,getFlagStats} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {samToolsFlagStatReportParser} from "./../../samToolsFlagStatReport";

/**
 * Populate the flagStatReport prop of alignData using its sorted bam
 * 
 * @export
 * @param {AlignData} alignData 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<void>} 
 */
export function samToolsFlagStat(alignData : AlignData,logger : atomic.AtomicOperation) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let samToolsExe = getReadable("samtools");
        
        let samToolsFlagStatStream : fs.WriteStream = fs.createWriteStream(getFlagStats(alignData));

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.unBufferedData)
                {
                    if(params.stdout)
                    {
                        samToolsFlagStatStream.write(params.unBufferedData);
                    }
                }
                else if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                samToolsFlagStatStream.end();
                                alignData.flagStatReport = samToolsFlagStatReportParser(
                                    <any>fs.readFileSync(
                                        getFlagStats(alignData)
                                    ).toString()
                                );
                                resolve();
                            },500
                        );
                    }
                    else
                    {
                        reject(`Failed to get flag statistics for ${alignData.alias}`);
                    }
                }
            }
        };
        let samToolsFlagStatJob = new Job(
            samToolsExe,
            <Array<string>>[
                "flagstat",
                getSortedBam(alignData)
            ],"",true,jobCallBack,{}
        );
        try
        {
            samToolsFlagStatJob.Run();
            logger.addPIDFromFork(samToolsFlagStatJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}