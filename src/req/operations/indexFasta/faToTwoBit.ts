import {IndexFastaForVisualization} from "./../indexFastaForVisualization";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {getPath} from "./../../file";

/**
 * Builds a 2bit archive 
 * 
 * @export
 * @param {IndexFastaForVisualization} op 
 * @returns {Promise<void>} 
 */
export function faToTwoBit(op : IndexFastaForVisualization) : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
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
                        return reject(`Failed to create 2bit index for ${op.fasta!.alias}`);
                    }
                }
            }
        };
        op.twoBitJob = new Job(
            op.faToTwoBitExe,
            <Array<string>>[
                getPath(op.fasta!),
                op.twoBitPath
            ],"",true,jobCallBack,{}
        );
        try
        {
            op.twoBitJob.Run();
            op.addPIDFromFork(op.twoBitJob.pid!);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}