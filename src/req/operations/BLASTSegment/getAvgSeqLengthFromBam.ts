import * as readline from "readline";

import * as atomic from "./../atomicOperations";
import {BLASTSegmentResult} from "./../../BLASTSegmentResult";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {getReadable} from "../../getAppPath";
import {AlignData,getSortedBam} from "../../alignData";

export function getAvgSeqLengthFromBam(
    segmentResult : BLASTSegmentResult,
    alignData : AlignData,
    logger : atomic.ForkLogger,
    progress : (read : number) => void
) : Promise<void> {
    return new Promise<void>((resolve,reject) => {
        let totalReads = 0;
        let sumLength = 0;

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode != 0)
                    {
                        reject(`Failed to get average sequence length from bam Error: ${params.unBufferedData}`);
                    }
                }
            }
        };

        let samToolsViewJob = new Job(
            getReadable("samtools"),
            <Array<string>>[
                "view",
                getSortedBam(alignData),
            ],"",true,jobCallBack,{}
        );

        try
        {
            samToolsViewJob.Run();
            let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
                input : samToolsViewJob.stdout
            });

            rl.on("line",function(line : string){
                totalReads += 1;
                let cols = line.split(/\s/g);
                sumLength += cols[9].length;
                progress(totalReads);
            });

            rl.on("close",function(){
                segmentResult.avgSeqLength = sumLength/totalReads;
                return resolve();
            });

            logger.addPIDFromFork(samToolsViewJob.pid);
        }

        catch(err)
        {
            return reject(err);
        }
    });
}
