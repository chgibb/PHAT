/// <reference types="jquery" />

import * as viewMgr from "./../viewMgr";
import * as cf from "./../circularFigure";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";

export class ContigCreator extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public contigStart : number = -1;
    public contigEnd : number = -1;
    public contigVAdjust : number = 0;
    public constructor(name : string,div : string)
    {
        super(name,div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
     public forceReRender()
    {
        cf.cacheBaseFigure(this.genome);
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
        genomeView.firstRender = true;
        masterView.firstRender = true;
        masterView.dataChanged();
        viewMgr.render();
    }
    public show() : void
    {
        this.mount();
        this.contigStart = -1;
        this.contigEnd = -1;
        document.getElementById(this.div).style.display = "block";
    }
    public hide() : void
    {
        let inputStart : number = parseInt((<HTMLInputElement>document.getElementById("contigStart")).value);
        let inputEnd : number = parseInt((<HTMLInputElement>document.getElementById("contigEnd")).value);
        let vAdjust : number = parseInt((<HTMLInputElement>document.getElementById("contigVAdjust")).value);
        if(inputStart && inputEnd && inputEnd != 0)
        {
            this.contigStart = inputStart;
            this.contigEnd = inputEnd
            this.contigVAdjust = vAdjust;
            let contig : cf.Contig = new cf.Contig();
            cf.initContigForDisplay(contig,true);
            contig.start = this.contigStart;
            contig.end = this.contigEnd;
            contig.vAdjust = this.contigVAdjust;
            contig.alias = "New Contig";
            contig.name = "Custom Annotation";  
            this.genome.customContigs.push(contig);
            this.forceReRender();
            console.log("rerendered");
        }
        console.log(inputStart+" "+inputEnd);
    
        document.getElementById(this.div).style.display = "none";
        this.unMount();
    }
    public renderView() : string | undefined
    {
        try
        {
            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
            let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
            this.genome = genomeView.genome;
            return `
                <div class="modalContent">
                    <div class="modalHeader">
                        <span id="closeCreator" class="modalCloseButton">&times;</span>
                        <p style="display:inline-block;">Vertical Adjustment</p>
                        <input type="text" id="contigVAdjust"style="display:inline-block;" />
                        <p style="display:inline-block;">Start</p>
                        <input type="text" id="contigStart"style="display:inline-block;" />
                        <p style="display:inline-block;">End</p>
                        <input type="text" id="contigEnd" style="display:inline-block;" />
                    </div>
                    <div class="modalBody">
                    </div>
                    <div class="modalFooter">
                    </div>
                </div>
            `;
        }
        catch(err)
        {
            return undefined;
        }
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(event.target.id == "closeCreator")
        {
            this.hide();
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new ContigCreator("contigCreator",div));
}