import {getReadable,getReadableAndWritable} from "./../../getAppPath";
import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {parseBowTie2AlignmentReport} from "./../../bowTie2AlignmentReportParser";

export function samToolsView(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.processName == op.samToolsExe && params.args[0] == "view")
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
        op.alignData.summary = parseBowTie2AlignmentReport(op.alignData.summaryText);
        op.samToolsViewJob = new Job(
            op.samToolsExe,
            <string[]>[
                "view",
                "-bS",
                getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sam`),
                "-o",
                getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.bam`),
            ],
            "",true,jobCallBack,{}
        );
        try
        {
            op.samToolsViewJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
    });
}