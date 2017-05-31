import * as fs from "fs";

import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function bowTie2Align(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.processName == op.bowtie2Exe)
                {
                    if(params.unBufferedData)
                        op.alignData.summaryText += params.unBufferedData;
                    op.spawnUpdate = params;
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            return resolve();
                        }
                        else
                        {
                            return reject(params.unBufferedData);
                        }
                    }
                }
            }
        };
        let args : Array<string> = new Array<string>();
        if(process.platform == "win32")
            args.push("resources/app/bowtie2");
        args.push("-x");
        args.push(`resources/app/rt/indexes/${op.fasta.uuid}`);
        args.push("-1");
        args.push(op.fastq1.path);
        args.push("-2");
        args.push(op.fastq2.path);
        args.push("-S");
        args.push(`resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/out.sam`);

        let invokeString = "";
        for(let i = 0; i != args.length; ++i)
        {
            invokeString += args[i];
            invokeString += " ";
        }
        op.alignData.invokeString = invokeString;
        op.alignData.alias = `${op.fastq1.alias}, ${op.fastq2.alias}; ${op.fasta.alias}`;
        fs.mkdirSync(`resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}`);
        fs.mkdirSync(`resources/app/rt/AlignmentArtifacts/${op.alignData.uuid}/contigCoverage`);
        op.bowtieJob = new Job(op.bowtie2Exe,args,"",true,jobCallBack,{});
        try
        {
            op.bowtieJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
        op.update();
    });
}