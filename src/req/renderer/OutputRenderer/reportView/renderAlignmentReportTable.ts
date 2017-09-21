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
                    if(masterView.alignData[i].fasta && masterView.alignData[i].fasta.uuid == masterView.fastaInputs[k].uuid)
                        foundRefSeqs++;
                    if(foundRefSeqs >= 1)
                        break;
                }
                if((foundFastqs >= 1 && foundRefSeqs >= 1) || masterView.alignData[i].isExternalAlignment)
                {
                    //for alignments from imported bams, we source some data points from samtools reports over bowtie2 reports

                    res += "<tr>";
                    if(rightPanel.alignmentInfoSelection.alias)
                        res += `<td class="activeHover" id="${masterView.alignData[i].uuid}ViewAlignment">${masterView.alignData[i].alias}</td>`;

                    if(rightPanel.alignmentInfoSelection.sizeInBytes)
                        res += `<td>${masterView.alignData[i].size}</td>`;

                    if(rightPanel.alignmentInfoSelection.formattedSize)
                        res += `<td>${masterView.alignData[i].sizeString}</td>`;

                    if(rightPanel.alignmentInfoSelection.reads)
                    {
                        if(!masterView.alignData[i].isExternalAlignment)
                        {
                            res += `<td>${masterView.alignData[i].summary.reads}</td>`;
                        }
                        else
                        {
                            res += `<td>${masterView.alignData[i].flagStatReport.reads}</td>`;
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.mates)
                    {
                        if(!masterView.alignData[i].isExternalAlignment)
                        {
                            res += `<td>${masterView.alignData[i].summary.mates}</td>`;
                        }
                        else
                        {
                            res += `<td>Unknown</td>`;
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.overallAlignmentRate)
                    {
                        if(!masterView.alignData[i].isExternalAlignment)
                        {
                            res += `<td class="activeHover" id="${masterView.alignData[i].uuid}AlignmentRate">${masterView.alignData[i].summary.overallAlignmentRate}</td>`;
                        }
                        else
                        {
                            res += `<td class="activeHover" id="${masterView.alignData[i].uuid}AlignmentRate">${masterView.alignData[i].flagStatReport.overallAlignmentRate}</td>`;
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.minimumCoverage)
                    {
                        if(masterView.alignData[i].varScanSNPSummary)
                        {
                            res += `<td>${masterView.alignData[i].varScanSNPSummary.minCoverage}</td>`;
                        }
                        else
                        {
                            res += `<td>Unknown</td>`;
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.minimumVariableFrequency)
                    {
                        if(masterView.alignData[i].varScanSNPSummary)
                        {
                            res += `<td>${masterView.alignData[i].varScanSNPSummary.minVarFreq}</td>`;
                        }
                        else
                        {
                            res += `<td>Unknown</td>`;
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.minimumAverageQuality)
                    {
                        if(masterView.alignData[i].varScanSNPSummary)
                        {
                            res += `<td>${masterView.alignData[i].varScanSNPSummary.minAvgQual}</td>`;
                        }
                        else
                        {
                            res += `<td>Unknown</td>`;
                        }
                    }
                    if(rightPanel.alignmentInfoSelection.pValueThreshold)
                    {
                        if(masterView.alignData[i].varScanSNPSummary)
                        {
                            res += `<td>${masterView.alignData[i].varScanSNPSummary.pValueThresh}</td>`;
                        }
                        else
                        {
                            res += `<td>Unknown</td>`;
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.SNPsPredicted)
                    {
                        if(masterView.alignData[i].varScanSNPSummary)
                        {
                            res += `<td class="activeHover" id="${masterView.alignData[i].uuid}ViewSNPs">${masterView.alignData[i].varScanSNPSummary.SNPsReported}</td>`;
                        }
                        else
                        {
                            res += `<td>Unknown</td>`;
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.indelsPredicted)
                    {
                        if(masterView.alignData[i].varScanSNPSummary)
                        {
                            res += `<td>${masterView.alignData[i].varScanSNPSummary.indelsReported}</td>`;
                        }
                        else
                        {
                            res += `<td>Unknown</td>`;
    
                        }
                    }

                    if(rightPanel.alignmentInfoSelection.dateRan)
                        res += `<td>${masterView.alignData[i].dateStampString}</td>`;
                    res += "</tr>";
                }
            }
            return res;
        })()}
        </table>
    `;
}