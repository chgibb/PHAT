import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";
import {getReadable} from "./../../../getAppPath";

export function renderMappedReadsPerContigTable() : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "MappedReadsPerContigInfo")
        return "";
    return `
        <img class="activeHover activeHoverButton" id="goBackToAlignments" src="${getReadable("img/GoBack.png")}">
        <table style="width:100%">
            ${(()=>{
                let res = "";
                res += `
                    <tr>
                        ${rightPanel.mapppedReadsPerContigInfoSelection.refSeqName != false ? "<th>Contig Name</th>" : ""}
                        ${rightPanel.mapppedReadsPerContigInfoSelection.seqLength != false ? "<th>Length</th>" : ""}
                        ${rightPanel.mapppedReadsPerContigInfoSelection.mappedReads != false ? "<th>Mapped Reads</th>" : ""}
                        ${rightPanel.mapppedReadsPerContigInfoSelection.unMappedReads != false ? "<th>Unmapped Reads</th>" : ""}
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
                        for(let k = 0; k != masterView.alignData[i].idxStatsReport.length-1; ++k)
                        {
                                res += "<tr>";
                                if(rightPanel.mapppedReadsPerContigInfoSelection.refSeqName)
                                    res += `<td>${masterView.alignData[i].idxStatsReport[k].refSeqName}</td>`;
                                if(rightPanel.mapppedReadsPerContigInfoSelection.seqLength)
                                    res += `<td>${masterView.alignData[i].idxStatsReport[k].seqLength}</td>`;
                                if(rightPanel.mapppedReadsPerContigInfoSelection.mappedReads)
                                    res += `<td>${masterView.alignData[i].idxStatsReport[k].mappedReads}</td>`;
                                if(rightPanel.mapppedReadsPerContigInfoSelection.unMappedReads)
                                    res += `<td>${masterView.alignData[i].idxStatsReport[k].unMappedReads}</td>`;
                                res += "</tr>";
                        }
                        break;
                    }
                }
                return res;
            })()}
        </table>
    `;
}