import canRead from "./../canRead";
import {SpawnRequestParams} from "./../../JobIPC";
import AlignMgr from "./../Align";
export default function replyFromSamToolsIndex(channel : string,arg : SpawnRequestParams,model : AlignMgr) : void
{
    
    if(!canRead(model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam.bai")))
        throw new Error(model.fsAccess("resources/app/rt/AlignmentArtifacts/"+arg.extraData+"/out.sorted.bam.bai"));
    for(let i = 0; i != model.aligns.length; ++i)
    {
        if(model.aligns[i].UUID == arg.extraData)
        {
            model.aligns[i].aligned = true;
            model.postAligns();
        }
    }

}