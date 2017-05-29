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
        args.push(`resources/app/rt/indexes/${this.fasta.uuid}`);
        args.push("-1");
        args.push(this.fastq1.path);
        args.push("-2");
        args.push(this.fastq2.path);
        args.push("-S");
        args.push(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}/out.sam`);

        let invokeString = "";
        for(let i = 0; i != args.length; ++i)
        {
            invokeString += args[i];
            invokeString += " ";
        }
        this.alignData.invokeString = invokeString;
        this.alignData.alias = `${this.fastq1.alias}, ${this.fastq2.alias}; ${this.fasta.alias}`;
        fs.mkdirSync(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}`);
        fs.mkdirSync(`resources/app/rt/AlignmentArtifacts/${this.alignData.uuid}/contigCoverage`);
        this.bowtieJob = new Job(this.bowtie2Exe,args,"",true,jobCallBack,{});
        try
        {
            this.bowtieJob.Run();
        }
        catch(err)
        {
            this.abortOperationWithMessage(err);
            return;
        }
        this.update();
    });
}