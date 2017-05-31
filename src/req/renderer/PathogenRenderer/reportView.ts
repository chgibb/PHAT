import * as viewMgr from "./../viewMgr";
import Fastq from "./../../fastq";
import {Fasta} from "./../../fasta";
import alignData from "./../../alignData";
import {PileUpView} from "./pileUpView";
export class ReportView extends viewMgr.View
{
    public selectedFastqInputs : Array<Fastq>;
    public selectedFastaInputs : Array<Fasta>;
    public aligns : Array<alignData>;
    public constructor(div : string)
    {
        super('report', div);
        this.selectedFastaInputs = new Array<Fasta>();
        this.selectedFastqInputs = new Array<Fastq>();
        this.aligns = new Array<alignData>();
    }
    onMount(){}
    onUnMount(){}
    renderView()
    {
        return `
            <table style='width:100%'>
                <tr>
                    <th>Name</th>
                    <th>Reads</th>
                    <th>Mates</th>
                    <th>Overall Alignment Rate %</th>
                    <th>Minimum Coverage</th>
                    <th>Minimum Variable Frequency</th>
                    <th>Minimum Average Quality</th>
                    <th>P-Value Threshold</th>
                    <th>SNPs Predicted</th>
                    <th>Indels Predicted</th>
                    <th>Date Ran</th>
                </tr>
                ${(()=>{
                    let res : string = "";
                    for(let i : number = 0; i != this.aligns.length; ++i)
                    {
                        if(this.aligns[i].type = "path")
                        {
                            let found : number = 0;
                            for(let k : number = 0; k != this.selectedFastaInputs.length; ++k)
                            {
                                if(this.selectedFastaInputs[k].uuid == this.aligns[i].fasta.uuid)
                                {
                                    found++;
                                    break;
                                }
                            }
                            if(found == 1)
                            {
                                for(let k : number = 0; k != this.selectedFastqInputs.length; ++k)
                                {
                                    if(this.selectedFastqInputs[k].uuid == this.aligns[i].fastqs[0].uuid)
                                    {
                                        found++;
                                        continue;
                                    }
                                    if(this.selectedFastqInputs[k].uuid == this.aligns[i].fastqs[1].uuid)
                                    {
                                        found++;
                                        continue;
                                    }
                                }
                            }
                            if(found == 3)
                            {
                                res += `
                                    <tr>
                                        <td><p id="${this.aligns[i].uuid}">${this.aligns[i].alias}</i></td>
                                        <td>${this.aligns[i].summary.reads}</td>
                                        <td>${this.aligns[i].summary.mates}</td>
                                        <td>${this.aligns[i].summary.overallAlignmentRate}</td>
                                        <td>${this.aligns[i].varScanSNPSummary.minCoverage}</td>
                                        <td>${this.aligns[i].varScanSNPSummary.minVarFreq}</td>
                                        <td>${this.aligns[i].varScanSNPSummary.minAvgQual}</td>
                                        <td>${this.aligns[i].varScanSNPSummary.pValueThresh}</td>
                                        <td>${this.aligns[i].varScanSNPSummary.SNPsReported}</td>
                                        <td>${this.aligns[i].varScanSNPSummary.indelsReported}</td>
                                        <td>${this.aligns[i].dateStampString}</td>
                                    </tr>
                                `;
                            }
                        }
                    }
                    return res;
                })()}
            </table>
        `;
    }
    postRender(){}
    divClickEvents(event : JQueryEventObject) : void
    {
        if(!event || !event.target || !event.target.id)
            return;
        for(let i = 0; i != this.aligns.length; ++i)
        {
            if(this.aligns[i].uuid == event.target.id)
            {
                if(this.aligns[i].summary.overallAlignmentRate != 0)
                {
                    (<PileUpView>viewMgr.getViewByName("pileUp")).report = this.aligns[i].uuid;
                    viewMgr.changeView("pileUp");
                    return;
                }
                else
                {
                    alert(`Can't view an alignment with 0% alignment rate`);
                    return;
                }
            }
        }
    }
    dataChanged(){}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new ReportView(div));
}