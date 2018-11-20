import * as fs from "fs";

import {getReadable} from "./../../getAppPath";
import {IndexFastaForHisat2Alignment} from "../indexFastaForHisat2Alignment";
import {getPath} from "./../../file";

import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

/**
 * Builds a hisat2 index
 * 
 * @export
 * @param {IndexFastaForHisat2Alignment} op 
 * @returns {(Promise<string | undefined>)} 
 */
export function hisat2Build(op : IndexFastaForHisat2Alignment) : Promise<string | undefined>
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
                        setTimeout(
                            function(){
                                try
                                {
                                    for(let i : number = 0; i != op.hisat2Indices.length; ++i)
                                    {
                                        fs.accessSync(`${op.hisat2Indices[i]}`,fs.constants.F_OK | fs.constants.R_OK);
                                    }
                                }
                                catch(err)
                                {
                                    reject(`Failed to write all hisat2 indices for ${op.fasta.alias}`);
                                }
                                resolve();
                            },5000
                        );
                    }
                }
            }
        }
        let hisat2Args : Array<string> = new Array<string>();
        if(process.platform == "linux")
            hisat2Args = [getPath(op.fasta),op.hisat2IndexPath];
        else if(process.platform == "win32")
        {
            hisat2Args = [
                getReadable(`hisat2-build`),
                `"${getPath(op.fasta)}"`,
                `"${op.hisat2IndexPath}"`
            ];
        }
        op.hisat2Job = new Job(op.hisat2BuildExe,hisat2Args,"",true,jobCallBack,{});
        try
        {
            op.hisat2Job.Run();
            op.addPIDFromFork(op.hisat2Job.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}
