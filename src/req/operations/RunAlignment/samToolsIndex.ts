import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {AlignData,getSortedBam,getSortBamIndex} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

/**
 * Produce a sorted bam index from the sorted bam managed by alignData
 * 
 * @export
 * @param {AlignData} alignData 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<void>} 
 */
export function samToolsIndex(alignData : AlignData,logger : atomic.AtomicOperation) : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        let samToolsExe = getReadable("samtools");

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.processName == samToolsExe && params.args[0] == "index")
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            return resolve();
                        }
                    }
                }
                else
                {
                    return reject(`Failed to index bam for ${alignData.alias}`);
                }
            }
        };
        let samToolsIndexJob = new Job(
            samToolsExe,
            <Array<string>>[
                "index",
                getSortedBam(alignData),
                getSortBamIndex(alignData)
            ],"",true,jobCallBack,{}
        );
        try
        {
            samToolsIndexJob.Run();
            logger.addPIDFromFork(samToolsIndexJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}