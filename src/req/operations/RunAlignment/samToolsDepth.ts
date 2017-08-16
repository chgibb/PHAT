import * as fs from "fs";
import * as readline from "readline";

import * as atomic from "./../atomicOperations";
import {AlignData,getSortedBam,getCoverage,getCoverageForContig} from "./../../alignData";
import {getReadable} from "./../../getAppPath";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsDepth(alignData: AlignData,logger : atomic.AtomicOperation) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');
        let samToolsCoverageFileStream : fs.WriteStream = fs.createWriteStream(getCoverage(alignData));

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.processName == samToolsExe && params.args[0] == "depth")
                {
                    if(params.unBufferedData)
                    {
                        //Forward through to the depth.coverage file
                        samToolsCoverageFileStream.write(params.unBufferedData);
                    }
                    else if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            setTimeout(
                                function(){
                                    samToolsCoverageFileStream.end();
                                    let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
                                        input : fs.createReadStream(getCoverage(alignData))
                                    });
                                    rl.on("line",function(line){
                                        //distill output from samtools depth into individual contig coverage files identified by uuid and without the contig name.
                                        let coverageTokens = line.split(/\s/g);
                                        for(let i = 0; i != alignData.fasta.contigs.length; ++i)
                                        {
                                            let contigTokens = alignData.fasta.contigs[i].name.split(/\s/g);
                                            for(let k = 0; k != coverageTokens.length; ++k)
                                            {
                                                if(coverageTokens[k] == contigTokens[0])
                                                {
                                                    fs.appendFileSync(getCoverageForContig(alignData,alignData.fasta.contigs[i].uuid),`${coverageTokens[k+1]} ${coverageTokens[k+2]}\n`);
                                                }
                                            }
                                        }
                                    });
                                    rl.on("close",function(){
                                        resolve();
                                    });
                                },500
                            );
                        }
                        else
                        {
                            reject(`Failed to get depth for ${alignData.alias}`);
                        }
                }
            }
        }
    }
    let samToolsDepthJob = new Job(
        samToolsExe,
        <Array<string>>[
            "depth",
            getSortedBam(alignData)
        ],"",true,jobCallBack,{}
    );
    try
    {
        samToolsDepthJob.Run();
    }
    catch(err)
    {
        return reject(err);
    }
    });
}