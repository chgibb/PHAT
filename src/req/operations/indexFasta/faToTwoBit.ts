import {IndexFasta} from "./../indexFasta";

import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

export function foToTwoBit(op : IndexFasta) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        return resolve();
                    }
                    else
                    {
                        return reject(`Failed to create 2bit index for ${op.fasta.alias}`);
                    }
                }
            }
        }
        op.twoBitJob = new Job(
            op.faToTwoBitExe,
            <Array<string>>[
                op.fasta.path,
                op.twoBitPath
            ],"",true,jobCallBack,{}
        );
        try
        {
            op.twoBitJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}