import {getReadable,getReadableAndWritable} from "./../../getAppPath";
import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsSort(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.processName == op.samToolsExe && params.args[0] == "sort")
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            resolve();
                        }
                        else
                        {
                            return reject(`Failed to sort bam for ${op.alignData.alias}`);
                        }
                    }
                }
            }
        }
        let input : string = getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.bam`);
        let output : string;
        output = getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`)

        let args : Array<string> = new Array<string>();
        args = <Array<string>>[
            "sort",
            input,
            "-o",
            output
        ];
        op.samToolsSortJob = new Job(op.samToolsExe,args,"",true,jobCallBack,{});
        try
        {
            op.samToolsSortJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}