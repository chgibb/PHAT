import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {AlignData,getUnSortedBam,getSortedBam} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

/**
 * Produce a sorted bam from the unsorted bam managed by alignData
 * 
 * @export
 * @param {AlignData} alignData 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<{}>} 
 */
export function samToolsSort(alignData : AlignData,logger : atomic.AtomicOperation) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.processName == samToolsExe && params.args[0] == "sort")
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            resolve();
                        }
                        else
                        {
                            return reject(`Failed to sort bam for ${alignData.alias}`);
                        }
                    }
                }
            }
        }
        let input : string = getUnSortedBam(alignData);
        let output : string;
        output = getSortedBam(alignData);

        let args : Array<string> = new Array<string>();
        args = <Array<string>>[
            "sort",
            input,
            "-o",
            output
        ];
        let samToolsSortJob = new Job(samToolsExe,args,"",true,jobCallBack,{});
        try
        {
            samToolsSortJob.Run();
            logger.addPIDFromFork(samToolsSortJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}