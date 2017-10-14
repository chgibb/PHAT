const fse = require("fs-extra");

import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {Fasta,getFaiPath} from "./../../fasta";
import {getPath} from "./../../file";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";

/**
 * Produces a samtools fai index for fasta
 * 
 * @export
 * @param {Fasta} fasta 
 * @param {atomic.AtomicOperation} logger 
 * @returns {Promise<{}>} 
 */
export function samToolsFaidx(fasta : Fasta,logger : atomic.AtomicOperation) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                try
                                {
                                    fse.copy(`${getPath(fasta)}.fai`,getFaiPath(fasta),function(err : string){
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
                getPath(fasta)
            ],"",true,jobCallBack,{}
        );
        try
        {
            faiJob.Run();
            logger.addPIDFromFork(faiJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}