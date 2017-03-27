/*let viewMgr = require('./../viewMgr');
let id = require('./../MakeValidID');
let contains = require('./../contains');*/
import * as viewMgr from "./../viewMgr";
import {DataModelMgr} from "./../model";
import Fastq from "./../fastq";
import Fasta from "./../fasta";
import alignData from "./../alignData";
import {PileUpView} from "./pileUpView";
export class ReportView extends viewMgr.View
{
    public selectedFastqInputs : Array<Fastq>;
    public selectedFastaInputs : Array<Fasta>;
    public aligns : Array<alignData>;
    public constructor(div : string,model : DataModelMgr)
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
        let html = new Array();
        html.push
        (
            "<table style='width:100%;'>",
            "<tr>",
            "<th>Name</th>",
            "<th>Reads</th>",
            "<th>Mates</th>",
            "<th>Overall Alignment Rate %</th>",
            "<th>Date Ran</th>",
            "</tr>"
        );
        for(let i = 0; i != this.aligns.length; ++i)
        {
            if(this.aligns[i].type == "path")
            {
                let sources = this.aligns[i].UUID.split(';');
                let found : number = 0;
                for(let k : number = 0; k != this.selectedFastqInputs.length; ++k)
                {
                    if(this.selectedFastqInputs[k].alias == sources[0] || this.selectedFastqInputs[k].alias == sources[1])
                        found++;
                    if(found == 2)
                        break;
                }
                for(let k : number = 0; k != this.selectedFastaInputs.length; ++k)
                {
                    if(this.selectedFastaInputs[k].alias == sources[2])
                    {
                        found++;
                        break;
                    }
                }
                if(found == 3)
                {
                    html.push
                    (
                        "<tr>",
                        "<td><p id='",this.aligns[i].UUID,"' >",this.aligns[i].alias,"</p></td>",
                        "<td>",this.aligns[i].summary.reads,"</td>",
                        "<td>",this.aligns[i].summary.mates,"</td>",
                        "<td>",this.aligns[i].summary.overallAlignmentRate,"</td>",
                        "<td>",this.aligns[i].dateStampString,"</td>",
                        "</tr>"
                    )
                }
            }
        }
        html.push("</table>");
        return html.join('');
    }
    postRender(){}
    divClickEvents(event : JQueryEventObject) : void
    {
        if(!event || !event.target || !event.target.id)
            return;
        for(let i = 0; i != this.aligns.length; ++i)
        {
            if(this.aligns[i].UUID == event.target.id)
            {
                (<PileUpView>viewMgr.getViewByName("pileUp")).report = this.aligns[i].UUID;
                viewMgr.changeView("pileUp");
                return;
            }
        }
    }
    dataChanged(){}
}
export function addView(arr : Array<viewMgr.View>,div : string,model? : DataModelMgr) : void
{
    arr.push(new ReportView(div,model));
}