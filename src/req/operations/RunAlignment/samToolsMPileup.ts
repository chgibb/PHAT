import * as fs from "fs";

import {getReadable} from "./../../getAppPath";
import {alignData,getSortedBam,getMPileup} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsMPileup(alignData : alignData) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let samToolsMPileupStream = fs.createWriteStream(getMPileup(alignData));

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.processName == samToolsExe && params.args[0] == "mpileup")
                {
                    if(params.unBufferedData && params.stdout)
                    {
                        samToolsMPileupStream.write(params.unBufferedData);
                    }
                    else if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            setTimeout(
                                function(){
                                    samToolsMPileupStream.end();
                                    resolve();
                                },500
                            );
                        }
                        else
                        {
                            reject(`Failed to generate pileup for ${alignData.alias}`);
                        }
                    }
                }
            }
        }
        let samToolsMPileupJob = new Job(
            samToolsExe,
            <Array<string>>[
                "mpileup",
                "-f",
                alignData.fasta.path,
                getSortedBam(alignData)
            ],"",true,jobCallBack,{}
        );
        try
        {
            samToolsMPileupJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
        
    });
}