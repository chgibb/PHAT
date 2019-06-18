import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";
import {getReadable} from "./../../../getAppPath";
import {getBLASTReadResults,getBLASTFragmentResults,BLASTSegmentResult,BLASTReadResult,BLASTFragmentResult} from "./../../../BLASTSegmentResult";


let lastBLASTUUID = "";

let lastViewedReadResults : Array<BLASTReadResult>;
let lastViewedFragmentResults : Array<BLASTFragmentResult>;

function refreshResults(resultsHandle : BLASTSegmentResult) : Promise<void>
{
    return new Promise<void>(async(resolve,reject) => 
    {
        if(lastBLASTUUID != resultsHandle.uuid)
        {
            lastBLASTUUID = resultsHandle.uuid;
            lastViewedReadResults = await getBLASTReadResults(resultsHandle);
            lastViewedFragmentResults = await getBLASTFragmentResults(resultsHandle);
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
            ${(()=>
    {
        let res = "";
        res += `
                    <tr>
                        ${rightPanel.BLASTSingleRunInfoSelection.position != false ? "<th>Position</th>" : ""}
                        ${rightPanel.BLASTSingleRunInfoSelection.seq != false ? "<th>Sequence</th>" : ""}
                        ${rightPanel.BLASTSingleRunInfoSelection.Hit_def != false ? "<th>Hit Definition</th>" : ""}
                        ${rightPanel.BLASTSingleRunInfoSelection.eValue != false ? "<th>E-Value</th>" : ""}
                    </tr>
                `;
        return res;
    })()}
            ${(()=>
    {
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
                            refreshResults(masterView.alignData[i].BLASTSegmentResults[k]).then(() => 
                            {
                                viewMgr.render();
                            });
                            return "";
                        }
                    }
                }
            }
        }
        for(let i = 0; i != lastViewedReadResults.length; ++i)
        {
            res += "<tr>";
            if(rightPanel.BLASTSingleRunInfoSelection.position)
                res += `<td>${lastViewedReadResults[i].readWithFragments.read.POS}</td>`;
            if(rightPanel.BLASTSingleRunInfoSelection.seq)
            {    
                res += "<td>";
                for(let k = 0; k != lastViewedReadResults[i].readWithFragments.fragments.length; ++k)
                {
                    if(lastViewedReadResults[i].readWithFragments.fragments[k].type == "mapped" || lastViewedReadResults[i].readWithFragments.fragments[k].type == "remainder")
                    {
                        res += `<span>${lastViewedReadResults[i].readWithFragments.fragments[k].seq}</span>`;
                    }
                    else if(lastViewedReadResults[i].readWithFragments.fragments[k].type == "unmapped")
                    {
                        let hoverText = "";
                        for(let j = 0; j != lastViewedFragmentResults.length; ++j)
                        {
                            if(lastViewedFragmentResults[j].readuuid == lastViewedReadResults[i].uuid)
                            {
                                if(lastViewedFragmentResults[j].results.noHits)
                                {
                                    hoverText = "No Hits";
                                    break;
                                }
                                else
                                {
                                    hoverText = lastViewedFragmentResults[j].results.BlastOutput.BlastOutput_iterations[0].Iteration[0].Iteration_hits[0].Hit[0].Hit_def[0];
                                    break;
                                }
                            }
                        }
                        res += `<span class="activeHover" style="color:red;" title="${hoverText}">${lastViewedReadResults[i].readWithFragments.fragments[k].seq}</span>`;
                    }
                }
                res += "</td>";
            }
            if(rightPanel.BLASTSingleRunInfoSelection.Hit_def)
            {
                let hitDef = lastViewedReadResults[i].results.BlastOutput.BlastOutput_iterations[0].Iteration[0].Iteration_hits[0].Hit[0].Hit_def[0];
                res += `<td>${hitDef}</td>`;
            }

            if(rightPanel.BLASTSingleRunInfoSelection.eValue)
            {
                let eValue = lastViewedReadResults[i].results.BlastOutput.BlastOutput_iterations[0].Iteration[0].Iteration_hits[0].Hit[0].Hit_hsps[0].Hsp[0].Hsp_evalue[0];
                res += `<td>${eValue}</td>`;
            }
            res += "</tr>";
        }
        return res;
    })()}
        </table>
        `;
}