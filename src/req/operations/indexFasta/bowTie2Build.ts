import * as fs from "fs";

import {IndexFasta} from "./../indexFasta";

import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function bowTie2Build(op : IndexFasta) : Promise<string | undefined>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                try
                                {
                                    for(let i : number = 0; i != op.bowtieIndices.length; ++i)
                                    {
                                        fs.accessSync(`${op.bowtieIndices[i]}`,fs.constants.F_OK | fs.constants.R_OK);
                                    }
                                }
                                catch(err)
                                {
                                    reject(`Failed to write all bowtie2 indices for ${op.fasta.alias}`);
                                }
                                resolve();
                            },5000
                        );
                    }
                }
            }
        }
        let bowTieArgs : Array<string> = new Array<string>();
        if(process.platform == "linux")
            bowTieArgs = [op.fasta.path,op.bowTieIndexPath];
        else if(process.platform == "win32")
        {
            bowTieArgs = [
                `resources/app/bowtie2-build`,
                `"${op.fasta.path}"`,
                `"${op.bowTieIndexPath}"`
            ];
        }
        op.bowtieJob = new Job(op.bowtie2BuildExe,bowTieArgs,"",true,jobCallBack,{});
        try
        {
            op.bowtieJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}
