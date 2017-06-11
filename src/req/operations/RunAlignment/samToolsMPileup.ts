import * as fs from "fs";

import {getReadableAndWritable} from "./../../getAppPath";
import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsMPileup(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.processName == op.samToolsExe && params.args[0] == "mpileup")
                {
                    if(params.unBufferedData && params.stdout)
                    {
                        op.samToolsMPileupStream.write(params.unBufferedData);
                    }
                    else if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            setTimeout(
                                function(){
                                    op.samToolsMPileupStream.end();
                                    resolve();
                                },500
                            );
                        }
                        else
                        {
                            reject(`Failed to generate pileup for ${op.alignData.alias}`);
                        }
                    }
                }
            }
        }
        op.samToolsMPileupJob = new Job(
            op.samToolsExe,
            <Array<string>>[
                "mpileup",
                "-f",
                op.fasta.path,
                getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`)
            ],"",true,jobCallBack,{}
        );
        try
        {
            op.samToolsMPileupJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
        op.samToolsMPileupStream = fs.createWriteStream(getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/pileup.mpileup`));
    });
}