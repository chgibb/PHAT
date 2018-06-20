import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";
import {getReadable} from "./../../../getAppPath";

import {getBLASTResults,BLASTSegmentResult} from "./../../../BLASTSegmentResult";
import {BlastOutputRawJSON} from "../../../BLASTOutput";

let lastBLASTUUID = "";

let lastViewedResults : Array<BlastOutputRawJSON>;

function refreshResults(resultsHandle : BLASTSegmentResult) : Promise<void>
{
    return new Promise<void>(async(resolve,reject) => {
        if(lastBLASTUUID != resultsHandle.uuid)
        {
            lastBLASTUUID = resultsHandle.uuid;
            lastViewedResults = await getBLASTResults(resultsHandle,0,0);
        }
        return resolve();
    });
}

export function renderBLASTSingleRunTable() : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "BLASTSingleRun")
        return "";
    return `
        <img class="activeHover activeHoverButton" id="goBackToBLASTRuns" src="${getReadable("img/GoBack.png")}">
        <table style="width:100%">
            ${(()=>{
                let res = "";
                res += `
                    <tr>
                        ${rightPanel.BLASTSingleRunInfoSelection.position != false ? "<th>Position</th>" : ""}
                        ${rightPanel.BLASTSingleRunInfoSelection.seq != false ? "<th>Sequence</th>" : ""}
                        ${rightPanel.BLASTSingleRunInfoSelection.Hit_def != false ? "<th>Hit Definition</th>" : ""}
                    </tr>
                `;
                return res;
            })()}
            ${(()=>{
                let res = "";
                for(let i = 0; i != masterView.alignData.length; ++i)
                {
                    if(masterView.alignData[i].uuid == masterView.inspectingAlignUUID)
                    {
                        for(let k = 0; k != masterView.alignData[i].BLASTSegmentResults.length; ++k)
                        {
                            if(masterView.alignData[i].BLASTSegmentResults[k].uuid == masterView.inspectingBLASTRunUUID)
                            {
                                if(lastBLASTUUID != masterView.inspectingBLASTRunUUID)
                                {
                                    refreshResults(masterView.alignData[i].BLASTSegmentResults[k]).then(() => {
                                        viewMgr.render();
                                    });
                                    return "";
                                }
                            }
                        }
                    }
                }
                for(let i = 0; i != lastViewedResults.length; ++i)
                {
                    res += `<tr>`;
                    if(rightPanel.BLASTSingleRunInfoSelection.position)
                        res += `<td>${lastViewedResults[i].readWithFragments.read.POS}</td>`;
                    if(rightPanel.BLASTSingleRunInfoSelection.seq)
                        res += `<td>${lastViewedResults[i].readWithFragments.read.SEQ}</td>`;
                    if(rightPanel.BLASTSingleRunInfoSelection.Hit_def)
                    {
                        let hitDef = lastViewedResults[i].BlastOutput.BlastOutput_iterations[0].Iteration[0].Iteration_hits[0].Hit[0].Hit_def[0];
                        res += `<td>${hitDef}</td>`;
                    }
                    res += `</tr>`;
                }
                return res;
            })()}
        </table>
        `;
}