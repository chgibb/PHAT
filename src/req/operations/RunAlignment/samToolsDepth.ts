import * as fs from "fs";
import * as readline from "readline";

import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsDepth(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.processName == op.samToolsExe && params.args[0] == "depth")
                {
                    if(params.unBufferedData)
                    {
                        //Forward through to the depth.coverage file
                        op.samToolsCoverageFileStream.write(params.unBufferedData);
                    }
                    else if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            setTimeout(
                                function(){
                                    op.samToolsCoverageFileStream.end();
                                    let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
                                        input : fs.createReadStream(`resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/depth.coverage`)
                                    });
                                    rl.on("line",function(line){
                                        //distill output from samtools depth into individual contig coverage files identified by uuid and without the contig name.
                                        let coverageTokens = line.split(/\s/g);
                                        for(let i = 0; i != op.fasta.contigs.length; ++i)
                                        {
                                            let contigTokens = op.fasta.contigs[i].name.split(/\s/g);
                                            for(let k = 0; k != coverageTokens.length; ++k)
                                            {
                                                if(coverageTokens[k] == contigTokens[0])
                                                {
                                                    fs.appendFileSync(`resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/contigCoverage/${op.fasta.contigs[i].uuid}`,`${coverageTokens[k+1]} ${coverageTokens[k+2]}\n`);
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
                            reject(`Failed to get depth for ${self.alignData.alias}`);
                        }
                }
            }
        }
    }
    op.samToolsDepthJob = new Job(
    op.samToolsExe,
        <Array<string>>[
            "depth",
            `resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`
        ],"",true,jobCallBack,{}
    );
    try
    {
        op.samToolsDepthJob.Run();
    }
    catch(err)
    {
        return reject(err);
    }
    op.samToolsCoverageFileStream = fs.createWriteStream(`resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/depth.coverage`)
    });
}