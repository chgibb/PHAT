import {IndexFastaForVisualization} from "./../indexFastaForVisualization";

import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {getPath} from "./../../file";

export function faToTwoBit(op : IndexFastaForVisualization) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                op.logObject(params);
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
                getPath(op.fasta),
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