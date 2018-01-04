import * as fs from "fs";

import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {AlignData,getSortedBam,getIdxStats} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {samToolsIdxStatsReportParser} from "./../../samToolsIdxStatsReport";

/**
 * Populate the idxStatsReport property on alignData from its sorted bam
 * 
 * @export
 * @param {AlignData} alignData 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<{}>} 
 */
export function samToolsIdxStats(alignData : AlignData,logger : atomic.AtomicOperation) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let samToolsIdxStatsStream : fs.WriteStream = fs.createWriteStream(getIdxStats(alignData));

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.unBufferedData)
                {
                    if(params.stdout)
                    {
                        samToolsIdxStatsStream.write(params.unBufferedData);
                    }
                }
                else if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                samToolsIdxStatsStream.end();
                                alignData.idxStatsReport = samToolsIdxStatsReportParser(
                                    <any>fs.readFileSync(
                                        getIdxStats(alignData)
                                    ).toString()
                                );
                                resolve();
                            },500
                        );
                    }
                    else
                    {
                        reject(`Failed to get index statistics for ${alignData.alias}`);
                    }
                }
            }
        };
        let samToolsIdxStatsJob = new Job(
            samToolsExe,
            <Array<string>>[
                "idxstats",
                getSortedBam(alignData)
            ],"",true,jobCallBack,{}
        );
        try
        {
            samToolsIdxStatsJob.Run();
            logger.addPIDFromFork(samToolsIdxStatsJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
        
    });
}