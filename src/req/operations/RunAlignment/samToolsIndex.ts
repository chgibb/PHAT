import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsIndex(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.processName == op.samToolsExe && params.args[0] == "index")
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
                    return reject(`Failed to index bam for ${op.alignData.alias}`);
                }
            }
        }
        op.samToolsIndexJob = new Job(
            op.samToolsExe,
            <Array<string>>[
                "index",
                `resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`,
                `resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam.bai`
            ],"",true,jobCallBack,{}
        );
        try
        {
            op.samToolsIndexJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}