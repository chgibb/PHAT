import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";

export function renderSNPPositionsTable() : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "SNPPositions")
        return "";
    return `
        <table style="width:100%">
        ${(()=>{
            let res = "";
            res += `
                <tr>
                    ${rightPanel.snpPositionsInfoSelection.chrom != false ? "<th>Chrom</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.position != false ? "<th>Position</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.ref != false ? "<th>Ref</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.var != false ? "<th>Var</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.consCovReads1Reads2FreqPValue != false ? "<th>Cons:Cov:Reads1:Reads2:Freq:P-value</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.strandFilterR1R1R2R2pVal != false ? "<th>StrandFilter:R1+:R1-:R2+:R2-:pval</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.samplesRef != false ? "<th>SamplesRef</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.samplesHet != false ? "<th>SamplesHet</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.samplesHom != false ? "<th>SamplesHom</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.samplesNC != false ? "<th>SamplesNC</th>" : ""}
                    ${rightPanel.snpPositionsInfoSelection.consCovReads1Reads2FreqPValue2 != false ? "<th>Cons:Cov:Reads1:Reads2:Freq:P-value</th>" : ""}
                </tr>
            `;
            return res;
        })()}
        </table>
    `;
}