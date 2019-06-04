import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";
import {getQCSummaryByNameOfReportByIndex} from "./../../../QCData";
import {getPath} from "./../../../file";

export function renderQCReportTable() : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "QCInfo")
        return "";
    return `
        <table style="width:100%">
        ${(()=>
    {
        let res = "";
        res += `
                    <tr>
                        ${rightPanel.fastQInfoSelection.alias != false ? "<th>Alias</th>" : ""}
                        ${rightPanel.fastQInfoSelection.fullName != false ? "<th>Full Path</th>" : ""}
                        ${rightPanel.fastQInfoSelection.sizeInBytes != false ? "<th>Size In Bytes</th>" : ""}
                        ${rightPanel.fastQInfoSelection.formattedSize != false ? "<th>Formatted Size</th>" : ""}
                        ${rightPanel.fastQInfoSelection.numberOfSequences != false ? "<th>Number of Sequences</th>" : ""}
                        ${rightPanel.fastQInfoSelection.PBSQ != false ? "<th>Per Base Sequence Quality</th>" : ""}
                        ${rightPanel.fastQInfoSelection.PSQS != false ? "<th>Per Sequence Quality Score</th>" : ""}
                        ${rightPanel.fastQInfoSelection.PSGCC != false ? "<th>Per Sequence GC Content</th>" : ""}
                        ${rightPanel.fastQInfoSelection.SDL != false ? "<th>Sequence Duplication Levels</th>" : ""}
                        ${rightPanel.fastQInfoSelection.ORS != false ? "<th>Over Represented Sequences</th>" : ""}
                    </tr>
            `;
        return res;
    })()}
        ${(()=>
    {
        let res = "";
        for(let i = 0; i != masterView.fastqInputs.length; ++i)
        {
            if(masterView.fastqInputs[i].checked)
            {
                res += "<tr>";
                if(rightPanel.fastQInfoSelection.alias)
                    res += `<td>${masterView.fastqInputs[i].alias}</td>`;

                if(rightPanel.fastQInfoSelection.fullName)
                    res += `<td>${getPath(masterView.fastqInputs[i])}</td>`;

                if(rightPanel.fastQInfoSelection.sizeInBytes)
                    res += `<td>${masterView.fastqInputs[i].size}</td>`;

                if(rightPanel.fastQInfoSelection.formattedSize)
                    res += `<td>${masterView.fastqInputs[i].sizeString}</td>`;

                if(rightPanel.fastQInfoSelection.numberOfSequences)
                    res += `<td>${masterView.fastqInputs[i].sequences}</td>`;

                if(rightPanel.fastQInfoSelection.PBSQ)
                    res += `<td>${getQCSummaryByNameOfReportByIndex(masterView.fastqInputs,i,"Per base sequence quality")}</td>`;

                if(rightPanel.fastQInfoSelection.PSQS)
                    res += `<td>${getQCSummaryByNameOfReportByIndex(masterView.fastqInputs,i,"Per sequence quality scores")}</td>`;

                if(rightPanel.fastQInfoSelection.PSGCC)
                    res += `<td>${getQCSummaryByNameOfReportByIndex(masterView.fastqInputs,i,"Per sequence GC content")}</td>`;

                if(rightPanel.fastQInfoSelection.SDL)
                    res += `<td>${getQCSummaryByNameOfReportByIndex(masterView.fastqInputs,i,"Sequence Duplication Levels")}</td>`;

                if(rightPanel.fastQInfoSelection.ORS)
                    res += `<td>${getQCSummaryByNameOfReportByIndex(masterView.fastqInputs,i,"Overrepresented sequences")}</td>`;

                res += "</tr>";
            }
        }
        return res;
    })()}
        </table>
    `;
}