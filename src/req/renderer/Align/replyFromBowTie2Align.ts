import canRead from "./../canRead";
import {SpawnRequestParams} from "./../../JobIPC";
import AlignMgr from "./../Align";
import {parseBowTie2AlignmentReport} from "./../bowTie2AlignmentReportParser";
export default function replyFromBowTie2Align(channel : string,arg : SpawnRequestParams,model : AlignMgr) : void
{
    if(arg.done && arg.retCode)
        throw new Error(JSON.stringify(arg,undefined,4));
    
    if(arg.unBufferedData)
    {
        for(let i = 0 ; i != model.aligns.length; ++i)
        {
            if(!model.aligns[i].aligned)
            {
                model.aligns[i].summaryText += arg.unBufferedData;
            }
        }
    }
    if(arg.done && arg.retCode == 0)
    {
       for(let i = 0; i != model.aligns.length; ++i)
        {
            if(model.aligns[i].UUID == arg.extraData)
            {
                
                if(!canRead(model.fsAccess("resources/app/rt/AlignmentArtifacts/"+model.aligns[i].UUID+"/out.sam")))
                    throw new Error("Could not write "+model.fsAccess("resources/app/rt/AlignmentArtifacts/"+model.aligns[i].UUID+"/out.sam"));
                model.aligns[i].summary = parseBowTie2AlignmentReport(model.aligns[i].summaryText);
                model.spawnHandle
                (
                    'spawn',
                    {
                        action : 'spawn',
                        replyChannel : model.channel,
                        processName : model.samTools,
                        args : 
                        [
                            "view",
                            "-bS",
                            model.fsAccess("resources/app/rt/AlignmentArtifacts/"+model.aligns[i].UUID+"/out.sam"),
                            "-o",
                            model.fsAccess("resources/app/rt/AlignmentArtifacts/"+model.aligns[i].UUID+"/out.bam")
                        ],
                        unBuffer : true,
                        extraData : model.aligns[i].UUID
                    }
                );
                return;
            }
        }
    }
}