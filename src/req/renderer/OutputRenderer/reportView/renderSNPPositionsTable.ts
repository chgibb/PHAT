import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";
import {VCF2JSONRow} from "./../../../varScanMPileup2SNPVCF2JSON";
import {getReadable} from "./../../../getAppPath";
export function renderSNPPositionsTable(rows : Array<VCF2JSONRow>) : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "SNPPositions")
        return "";
    return `
        <img class="activeHover" id="goBackToAlignments" src="${getReadable("img/GoBack.png")}">
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
        ${(()=>{
            let res = "";
            
            for(let i = 0; i != rows.length-1; ++i)
            {
                res += "<tr>";

                if(rightPanel.snpPositionsInfoSelection.chrom)
                    res += `<td>${rows[i].chrom}</td>`;
                
                if(rightPanel.snpPositionsInfoSelection.position)
                    res += `<td class="activeHover" id="viewSNP${i}">${rows[i].position}</td>`;

                if(rightPanel.snpPositionsInfoSelection.ref)
                    res += `<td>${rows[i].ref}</td>`;
                
                if(rightPanel.snpPositionsInfoSelection.var)
                    res += `<td>${rows[i].var}</td>`;

                if(rightPanel.snpPositionsInfoSelection.consCovReads1Reads2FreqPValue)
                    res += `<td>${rows[i].consCovReads1Reads2FreqPValue}</td>`;

                if(rightPanel.snpPositionsInfoSelection.strandFilterR1R1R2R2pVal)
                    res += `<td>${rows[i].strandFilterR1R1R2R2pVal}</td>`;

                if(rightPanel.snpPositionsInfoSelection.samplesRef)
                    res += `<td>${rows[i].samplesRef}</td>`;

                if(rightPanel.snpPositionsInfoSelection.samplesHet)
                    res += `<td>${rows[i].samplesHet}</td>`;

                if(rightPanel.snpPositionsInfoSelection.samplesHom)
                    res += `<td>${rows[i].samplesHom}</td>`;

                if(rightPanel.snpPositionsInfoSelection.samplesNC)
                    res += `<td>${rows[i].samplesNC}</td>`;

                if(rightPanel.snpPositionsInfoSelection.consCovReads1Reads2FreqPValue2)
                    res += `<td>${rows[i].consCovReads1Reads2FreqPValue2}</td>`;

                res += "</tr>";
            }

            return res;
        })()}
        </table>
    `;
}