import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";
import {getReadable} from "./../../../getAppPath";

export function renderBLASTRunsTable() : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "BLASTRuns")
        return "";
    return `
        <img class="activeHover activeHoverButton" id="goBackToAlignments" src="${getReadable("img/GoBack.png")}">
        <table style="width:100%">
            ${(()=>{
                let res = "";
                res += `
                    <tr>
                        ${rightPanel.BLASTRunsInfoSelection.start != false ? "<th>Start</th>" : ""}
                        ${rightPanel.BLASTRunsInfoSelection.stop != false ? "<th>Stop</th>" : ""}
                        ${rightPanel.BLASTRunsInfoSelection.readsBLASTed != false ? "<th>Reads BLASTed</th>" : ""}
                        ${rightPanel.BLASTRunsInfoSelection.program != false ? "<th>Program</th>" : ""}
                        ${rightPanel.BLASTRunsInfoSelection.dataBase != false ? "<th>Database</th>" : ""}
                        ${rightPanel.BLASTRunsInfoSelection.ran != false ? "<th>Date Ran</th>" : ""}
                    </tr>
                `;
                return res;
            })()}
            ${(()=>{
                let res = "";
                for(let i = 0; i != masterView.alignData.length; ++i)
                {
                    if(masterView.alignData[i].uuid == masterView.inspectingUUID)
                    {
                        for(let k = 0; k != masterView.alignData[i].BLASTSegmentResults.length; ++k)
                        {
                            res += `<tr class="activeHover" id="${masterView.alignData[i].BLASTSegmentResults[k].uuid}ViewReads">`;
                            if(rightPanel.BLASTRunsInfoSelection.start)
                                res += `<td class="propogateParent">${masterView.alignData[i].BLASTSegmentResults[k].start}</td>`;
                            if(rightPanel.BLASTRunsInfoSelection.stop)
                                res += `<td class="propogateParent">${masterView.alignData[i].BLASTSegmentResults[k].stop}</td>`;
                            if(rightPanel.BLASTRunsInfoSelection.readsBLASTed)
                                res += `<td class="propogateParent">${masterView.alignData[i].BLASTSegmentResults[k].readsBLASTed}</td>`;
                            if(rightPanel.BLASTRunsInfoSelection.program)
                                res += `<td class="propogateParent">${masterView.alignData[i].BLASTSegmentResults[k].program}</td>`;
                            if(rightPanel.BLASTRunsInfoSelection.dataBase)
                                res += `<td class="propogateParent">${masterView.alignData[i].BLASTSegmentResults[k].dataBase}</td>`;
                            if(rightPanel.BLASTRunsInfoSelection.ran)
                                res += `<td class="propogateParent">${masterView.alignData[i].BLASTSegmentResults[k].dateStampString}</td>`;
                            res += "</tr>"
                        }
                    }
                }
                return res;
            })()}
        </table>
    `;
}