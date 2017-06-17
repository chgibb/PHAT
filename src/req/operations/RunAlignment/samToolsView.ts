import {getReadable,getReadableAndWritable} from "./../../getAppPath";
import {alignData,getSam,getUnSortedBam} from "./../../alignData";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {parseBowTie2AlignmentReport} from "./../../bowTie2AlignmentReportParser";

export function samToolsView(alignData : alignData) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let samToolsExe = getReadable('samtools');

        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
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
        let samToolsViewJob = new Job(
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
        try
        {
            samToolsViewJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}