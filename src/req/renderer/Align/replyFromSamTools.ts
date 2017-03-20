import {SpawnRequestParams} from "./../../JobIPC";
import AlignMgr from "./../Align";

import replyFromSamToolsView from "./replyFromSamToolsView";
import replyFromSamToolsSort from "./replyFromSamToolsSort";
import replyFromSamToolsIndex from "./replyFromSamToolsIndex";
export default function replyFromSamTools(channel : string,arg : SpawnRequestParams,model : AlignMgr) : void
{
    if(arg.args[0] == "view")
        replyFromSamToolsView(channel,arg,model);
    if(arg.args[0] == "sort")
        replyFromSamToolsSort(channel,arg,model);
    if(arg.args[0] == "index")
        replyFromSamToolsIndex(channel,arg,model);
}