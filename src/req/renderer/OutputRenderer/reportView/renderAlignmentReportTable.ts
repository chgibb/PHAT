import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";

export function renderAlignmentReportTable() : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "AlignmentInfo")
        return "";
    return `
        <table style="width:100%">
        ${(()=>{
            let res = "";
            res += `
                <tr>
                    ${rightPanel.alignmentInfoSelection.alias != false ? "<th>Alias</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.sizeInBytes != false ? "<th>Size In Bytes</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.formattedSize != false ? "<th>Formatted Size</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.reads != false ? "<th>Reads</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.mates != false ? "<th>Mates</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.overallAlignmentRate != false ? "<th>Overall Alignment Rate %</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.minimumCoverage != false ? "<th>Minimum Coverage</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.minimumVariableFrequency != false ? "<th>Minimum Variable Frequency</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.minimumAverageQuality != false ? "<th>Minimum Average Quality</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.pValueThreshold != false ? "<th>P-Value Threshold</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.SNPsPredicted != false ? "<th>SNPs Predicted</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.indelsPredicted != false ? "<th>Indels Predicted</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.dateRan != false ? "<th>Date Ran</th>" : ""}
                    ${rightPanel.alignmentInfoSelection.SNPPositions != false ? "<th>SNP Positions</th>" : ""}
                </tr>
            `;
            return res;
        })()}
        ${(()=>{
            let res = "";

            for(let i = 0; i != masterView.alignData.length; ++i)
            {
                let foundFastqs = 0;
                let foundRefSeqs = 0;
                for(let k = 0; k != masterView.fastqInputs.length; ++k)
                {
                    if(!masterView.fastqInputs[k].checked)
                        continue;
                    if(masterView.alignData[i].fastqs[0])
                    {
                        if(masterView.fastqInputs[k].uuid == masterView.alignData[i].fastqs[0].uuid)
                            foundFastqs++;
                    }
                    if(masterView.alignData[i].fastqs[1])
                    {
                        if(masterView.fastqInputs[k].uuid == masterView.alignData[i].fastqs[1].uuid)
                            foundFastqs++;
                    }
                    if(foundFastqs >= 1)
                        break;
                }
                for(let k = 0; k != masterView.fastaInputs.length; ++k)
                {
                    if(!masterView.fastaInputs[k].checked)
                        continue;
                    if(masterView.alignData[i].fasta.uuid == masterView.fastaInputs[k].uuid)
                        foundRefSeqs++;
                    if(foundRefSeqs >= 1)
                        break;
                }
                if(foundFastqs >= 1 && foundRefSeqs >= 1)
                {
                    res += "<tr>";
                    if(rightPanel.alignmentInfoSelection.alias)
                        res += `<td>${masterView.alignData[i].alias}</td>`;

                    if(rightPanel.alignmentInfoSelection.sizeInBytes)
                        res += `<td>${0}</td>`;

                    if(rightPanel.alignmentInfoSelection.formattedSize)
                        res += `<td>${0}</td>`;

                    if(rightPanel.alignmentInfoSelection.reads)
                        res += `<td>${masterView.alignData[i].summary.reads}</td>`;

                    if(rightPanel.alignmentInfoSelection.mates)
                        res += `<td>${masterView.alignData[i].summary.mates}</td>`;

                    if(rightPanel.alignmentInfoSelection.overallAlignmentRate)
                        res += `<td>${masterView.alignData[i].summary.overallAlignmentRate}</td>`;

                    if(rightPanel.alignmentInfoSelection.minimumCoverage)
                        res += `<td>${masterView.alignData[i].varScanSNPSummary.minCoverage}</td>`;

                    if(rightPanel.alignmentInfoSelection.minimumVariableFrequency)
                        res += `<td>${masterView.alignData[i].varScanSNPSummary.minVarFreq}</td>`;

                    if(rightPanel.alignmentInfoSelection.minimumAverageQuality)
                        res += `<td>${masterView.alignData[i].varScanSNPSummary.minAvgQual}</td>`;

                    if(rightPanel.alignmentInfoSelection.pValueThreshold)
                        res += `<td>${masterView.alignData[i].varScanSNPSummary.pValueThresh}</td>`;

                    if(rightPanel.alignmentInfoSelection.SNPsPredicted)
                        res += `<td>${masterView.alignData[i].varScanSNPSummary.SNPsReported}</td>`;

                    if(rightPanel.alignmentInfoSelection.indelsPredicted)
                        res += `<td>${masterView.alignData[i].varScanSNPSummary.indelsReported}</td>`;

                    if(rightPanel.alignmentInfoSelection.dateRan)
                        res += `<td>${masterView.alignData[i].dateStampString}</td>`;
                }
            }
            return res;
        })()}
        </table>
    `;
}