import * as fs from "fs";
import * as readline from "readline";

import * as atomic from "./../atomicOperations";
import {AlignData,getSortedBam,getCoverage,getCoverageForContig,getCoverageDir} from "./../../alignData";
import {getReadable} from "./../../getAppPath";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

/**
 * Populate contig coverage files from alignDatas sorted bam
 * 
 * @export
 * @param {AlignData} alignData 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<void>} 
 */
export function samToolsDepth(alignData: AlignData,logger : atomic.AtomicOperation) : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        let samToolsExe = getReadable("samtools");
        try
        {
            fs.mkdirSync(getCoverageDir(alignData));
        }
        catch(err)
        {
            err;
        }
        
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
                            atomic.logString(logger.logRecord,`Finished samtools`);
                            setTimeout(
                                function()
                                {
                                    samToolsCoverageFileStream.end();
                                    atomic.logString(logger.logRecord,`Starting distillation`);
                                    let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
                                        input : fs.createReadStream(getCoverage(alignData))
                                    });

                                    atomic.logString(logger.logRecord,`Path is ${getCoverage(alignData)}`);
                                    rl.on("line",function(line){
                                        atomic.logString(logger.logRecord,`Got a line`);
                                        
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
                                        atomic.logString(logger.logRecord,`Distillation closed`);
                                        resolve();
                                    });

                                    rl.on("error",function(err){
                                        atomic.logString(logger.logRecord,`Distillation threw error ${err}`);
                                        reject(err);
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
        };
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
            logger.addPIDFromFork(samToolsDepthJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}