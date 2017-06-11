const fse = require("fs-extra");

import {IndexFasta} from "./../indexFasta";
import {RunAlignment} from "./../RunAlignment";

import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsFaidx(op : IndexFasta | RunAlignment) : Promise<{}>
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
                                    fse.copy(`${op.fasta.path}.fai`,op.faiPath,function(err : string){
                                        if(err)
                                            reject(err);
                                        resolve();
                                    });
                                }
                                catch(err)
                                {
                                    return reject(err);
                                }
                            },1000
                        );
                    }
                    else
                    {
                        return reject(`Failed to create fai index for ${op.fasta.alias}`);
                    }
                }
            }
        }
        op.faiJob = new Job(
            op.samToolsExe,
            <Array<string>>[
                "faidx",
                op.fasta.path
            ],"",true,jobCallBack,{}
        );
        try
        {
            op.faiJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}