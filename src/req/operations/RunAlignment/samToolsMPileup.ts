import * as fs from "fs";

import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {AlignData,getSortedBam,getMPileup} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {getPath} from "./../../file";

export function samToolsMPileup(alignData : AlignData,logger : atomic.AtomicOperation) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let samToolsMPileupStream = fs.createWriteStream(getMPileup(alignData));

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
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
                getPath(alignData.fasta),
                getSortedBam(alignData)
            ],"",true,jobCallBack,{}
        );
        try
        {
            samToolsMPileupJob.Run();
            logger.addPIDFromFork(samToolsMPileupJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
        
    });
}