import * as fs from "fs";

import {getReadable} from "./../../getAppPath";
import {IndexFastaForBowTie2Alignment} from "../indexFastaForBowTie2Alignment";
import {getPath} from "./../../file";

import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

/**
 * Builds a bowtie2 index
 * 
 * @export
 * @param {IndexFastaForBowTie2Alignment} op 
 * @returns {(Promise<string | undefined>)} 
 */
export function bowTie2Build(op : IndexFastaForBowTie2Alignment) : Promise<string | undefined>
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
            bowTieArgs = [getPath(op.fasta),op.bowTieIndexPath];
        else if(process.platform == "win32")
        {
            bowTieArgs = [
                getReadable(`bowtie2-build`),
                `"${getPath(op.fasta)}"`,
                `"${op.bowTieIndexPath}"`
            ];
        }
        op.bowtieJob = new Job(op.bowtie2BuildExe,bowTieArgs,"",true,jobCallBack,{});
        try
        {
            op.bowtieJob.Run();
            op.addPIDFromFork(op.bowtieJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}
