const fse = require("fs-extra");

import {getReadable} from "./../../getAppPath";
import {Fasta,getFaiPath} from "./../../fasta";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function samToolsFaidx(fasta : Fasta) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

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
                                    fse.copy(`${fasta.path}.fai`,getFaiPath(fasta),function(err : string){
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
                        return reject(`Failed to create fai index for ${fasta.alias}`);
                    }
                }
            }
        }
        let faiJob = new Job(
            samToolsExe,
            <Array<string>>[
                "faidx",
                fasta.path
            ],"",true,jobCallBack,{}
        );
        try
        {
            faiJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}