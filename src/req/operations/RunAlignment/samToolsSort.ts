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
        let input : string = `resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/out.bam`;
        let output : string;
        if(process.platform == "win32")
            output = `resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted`
        else if(process.platform == "linux")
            output = `resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`

        let args : Array<string> = new Array<string>();
        if(process.platform == "linux")
        {
            args = <Array<string>>[
                "sort",
                input,
                "-o",
                output
            ];
        }
        //samtools sort options are slightly different on windows for some reason
        else if(process.platform == "win32")
        {
            args = <Array<string>>[
                "sort",
                input,
                output
            ];
        }
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