import * as atomic from "./../atomicOperations";
import {getReadable} from "./../../getAppPath";
import {AlignData,getSam,getUnSortedBam} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {parseBowTie2AlignmentReport} from "./../../bowTie2AlignmentReportParser";

export function samToolsView(alignData : AlignData,logger : atomic.AtomicOperation,fastaPath? : string) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                logger.logObject(params);
                if(params.processName == samToolsExe && params.args[0] == "view")
                {
                    if(params.done && params.retCode !== undefined)
                    {
                        if(params.retCode == 0)
                        {
                            resolve();
                        }
                        else
                        {
                            return reject(params.unBufferedData);
                        }
                    }
                }
            }
        }
        alignData.summary = parseBowTie2AlignmentReport(alignData.summaryText);
        let samToolsViewJob : Job;
        if(!fastaPath)
        {
             samToolsViewJob = new Job(
                samToolsExe,
                <string[]>[
                    "view",
                    "-bS",
                    getSam(alignData),
                    "-o",
                    getUnSortedBam(alignData)
                ],
                "",true,jobCallBack,{}
            );
        }
        else if(fastaPath)
        {
            samToolsViewJob = new Job(
                samToolsExe,
                <string[]>[
                    "view",
                    "-bS",
                    getSam(alignData),
                    "-T",
                    fastaPath,
                    "-o",
                    getUnSortedBam(alignData)
                ],
                "",true,jobCallBack,{}
            );
        }
        try
        {
            samToolsViewJob.Run();
            logger.addPIDFromFork(samToolsViewJob.pid);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}