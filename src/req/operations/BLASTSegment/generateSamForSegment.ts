import * as fs from "fs";

import * as atomic from "./../atomicOperations";
import {BLASTSegmentResult,getSamSegment} from "./../../BLASTSegmentResult";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {getReadable} from "../../getAppPath";
import {AlignData,getSortedBam} from "../../alignData";

export function generateSamForSegment(
    segmentResult : BLASTSegmentResult,
    alignData : AlignData,
    logger : atomic.ForkLogger,
    progress : (read : number) => void
) : Promise<number> {
    return new Promise<number>((resolve,reject) => {
        let totalReads = 0;

        let samStream : fs.WriteStream = fs.createWriteStream(getSamSegment(segmentResult));

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.unBufferedData)
                {
                    samStream.write(params.unBufferedData);
                    
                    let readLines = params.unBufferedData.split("\n");

                    for(let i = 0; i != readLines.length; ++i)
                    {
                        if(readLines[i])
                            totalReads += 1;
                    }

                    progress(totalReads);

                }

                else if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                samStream.end();
                                resolve(totalReads);
                            },
                            500
                        )
                    }
                    else
                    {
                        reject(`Failed to generate SAM for segment ${segmentResult.start} to ${segmentResult.stop} Error: ${params.unBufferedData}`);
                    }
                }
            }
        };

        let contigRefName : string;

        for(let i = 0; i != alignData.fasta.contigs.length; ++i)
        {
            if(alignData.fasta.contigs[i].uuid == segmentResult.contigUUID)
            {
                contigRefName = alignData.fasta.contigs[i].name.split(/\s/g)[0];
                break;
            }
        }

        let samToolsViewJob = new Job(
            getReadable("samtools"),
            <Array<string>>[
                "view",
                getSortedBam(alignData),
                `${contigRefName}:${segmentResult.start}-${segmentResult.stop}`
            ],"",true,jobCallBack,{}
        );

        try
        {
            samToolsViewJob.Run();
            logger.addPIDFromFork(samToolsViewJob.pid);
        }

        catch(err)
        {
            return reject(err);
        }
    });
}