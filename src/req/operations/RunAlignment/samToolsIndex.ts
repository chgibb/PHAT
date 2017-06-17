import {getReadable,getReadableAndWritable} from "./../../getAppPath";
import {alignData,getSortedBam,getSortBamIndex} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsIndex(alignData : alignData) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
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
        }
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
        }
        catch(err)
        {
            return reject(err);
        }
    });
}