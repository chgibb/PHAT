import * as fs from "fs";

import {getReadableAndWritable} from "./../../getAppPath";
import {RunAlignment} from "./../RunAlignment";
import {SpawnRequestParams} from "./../../JobIPC";
import {Job,JobCallBackObject} from "./../../main/Job";
import {samToolsIdxStatsReportParser} from "./../../samToolsIdxStatsReport";

export function samToolsIdxStats(op : RunAlignment) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let jobCallBack : JobCallBackObject = {
            send(channel : string,params : SpawnRequestParams)
            {
                if(params.unBufferedData)
                {
                    if(params.stdout)
                    {
                        op.samToolsIdxStatsStream.write(params.unBufferedData);
                    }
                }
                else if(params.done && params.retCode !== undefined)
                {
                    if(params.retCode == 0)
                    {
                        setTimeout(
                            function(){
                                op.samToolsIdxStatsStream.end();
                                op.alignData.idxStatsReport = samToolsIdxStatsReportParser(
                                    <any>fs.readFileSync(
                                        getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/idxstats`)
                                    ).toString()
                                );
                                resolve();
                            },500
                        );
                    }
                    else
                    {
                        reject(`Failed to get index statistics for ${op.alignData.alias}`);
                    }
                }
            }
        };
        op.samToolsIdxStatsJob = new Job(
            op.samToolsExe,
            <Array<string>>[
                "idxstats",
                getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/out.sorted.bam`)
            ],"",true,jobCallBack,{}
        );
        try
        {
            op.samToolsIdxStatsJob.Run();
        }
        catch(err)
        {
            return reject(err);
        }
        op.samToolsIdxStatsStream = fs.createWriteStream(getReadableAndWritable(`rt/AlignmentArtifacts/${op.alignData.uuid}/idxstats`));
    });
}