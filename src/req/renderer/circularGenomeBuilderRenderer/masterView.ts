/// <reference types="jquery" />

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {SaveKeyEvent} from "./../../ipcEvents";
import * as viewMgr from "./../viewMgr";
import {DataModelMgr} from "./../model";
import {CircularFigure,} from "./../circularFigure";
import {Fasta} from "./../../fasta";

import * as GenomeView from "./genomeView";
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender : boolean;
    public leftPanelOpen : boolean;
    public rightPanelOpen : boolean;
    public circularFigures : Array<CircularFigure>;
    public fastaInputs : Array<Fasta>;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.firstRender = true;
        this.leftPanelOpen = false;
        this.rightPanelOpen = false;
        this.circularFigures = new Array<CircularFigure>();
        this.fastaInputs = new Array<Fasta>();
    }
    public onMount() : void
    {
        GenomeView.addView(this.views,"genomeView");
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].onMount();
        }
    }
    public onUnMount() : void
    {
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].onUnMount();
        }
    }
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.leftPanelOpen = false;
            this.rightPanelOpen = false;
            this.firstRender = false;
            return `
                <button id="leftPanel" class="leftSlideOutPanel">Left Panel</button>
                <button id="rightPanel" class="rightSlideOutPanel">Right Panel</button>
                <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                    <button id="heightPlus">Increase Height</button>
                    <button id="widthPlus">Increase Width</button>
                    <button id="radiusMinus">Decrease Radius</button>
                    <button id="radiusPlus">Increase Radius</button>
                </div>
                <div id="leftSlideOutPanel" class="leftSlideOutPanel">
                ${
                    (
                        ()=>
                        {
                            let res = "\n";
                            if(this.fastaInputs)
                            {
                                for(let i = 0; i != this.fastaInputs.length; ++i)
                                {
                                    if(this.fastaInputs[i].checked && this.fastaInputs[i].indexed)
                                    {
                                        res += `<div id ="${this.fastaInputs[i].uuid}">
                                                <h3>${this.fastaInputs[i].alias}</h3>
                                                <button id="${this.fastaInputs[i].uuid}_newFigure" style="float:right;">New Figure</button>
                                                `;
                                        for(let k = 0; k != this.circularFigures.length; ++k)
                                        {
                                            if(this.circularFigures[k].uuidFasta == this.fastaInputs[i].uuid)
                                            {
                                                res += `<input type="radio" id="${this.circularFigures[k].uuid}" name="selectedFigure" /><p>${this.circularFigures[k].name}</p>`;
                                            }
                                        }
                                        res += `</div>`;
                                    }
                                }
                            }
                            return res;
                        }
                    )()}
                    </div>
                `;
            }
            for(let i = 0; i != this.views.length; ++i)
            {
                this.views[i].render();
            }
            //viewMgr will not call postRender for a view that does no rendering so we'll do it explicitly
            this.postRender();
            return undefined;
    }
    public postRender() : void
    {
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].postRender();
        }
    }
    public dataChanged() : void
    {
        ipc.send(
            "saveKey",
            <SaveKeyEvent>{
                action : "saveKey",
                channel : "circularGenomeBuilder",
                key : "circularFigures",
                val : this.circularFigures
            }
        );
    }
    public divClickEvents(event : JQueryEventObject) : void
    {
        let me = this;
        if(event.target.id == "rightPanel")
        {
            $("#rightSlideOutPanel").animate
            (
                {
                    "margin-right" : 
                    (
                        function()
                        {
                            if(!me.rightPanelOpen)
                            {
                                me.rightPanelOpen = true;
                                return "+=50%";
                            }
                            if(me.rightPanelOpen)
                            {
                                me.rightPanelOpen = false;
                                return "-=50%";
                            }
                            return "";
                        }
                    )()
                }
            );
        }
        if(event.target.id == "leftPanel")
        {
            $("#leftSlideOutPanel").animate
            (
                {
                    "margin-left" : 
                    (
                        function()
                        {
                            if(!me.leftPanelOpen)
                            {
                                me.leftPanelOpen = true;
                                return "+=50%";
                            }
                            if(me.leftPanelOpen)
                            {
                                me.leftPanelOpen = false;
                                return "-=50%";
                            }
                            return "";
                        }
                    )()
                }
            );
        }
        let ref = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(event.target.id == "radiusPlus")
        {
            ref.genome.radius += 10;
            viewMgr.render();
            this.dataChanged();
            return;
        }
        if(event.target.id == "radiusMinus")
        {
            ref.genome.radius -= 10;
            viewMgr.render();
            this.dataChanged();
            return;
        }
        if(event.target.id == "heightPlus")
        {
            ref.genome.height += 10;
            viewMgr.render();
            this.dataChanged();
            return;
        }
        if(event.target.id == "widthPlus")
        {
            ref.genome.width += 10;
            viewMgr.render();
            this.dataChanged();
            return;
        }
        if(this.fastaInputs)
        {
            for(let i = 0; i != this.fastaInputs.length; ++i)
            {
                if(event.target.id == `${this.fastaInputs[i].uuid}_newFigure`)
                {
                    this.circularFigures.push(new CircularFigure("New Figure",this.fastaInputs[i].uuid,this.fastaInputs[i].contigs));
                    let ref = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
                    ref.genome = this.circularFigures[this.circularFigures.length - 1];
                    viewMgr.render();
                    this.dataChanged();
                    this.firstRender = true;
                    return;
                }
            }
        }
        for(let i : number = 0; i != this.circularFigures.length; ++i)
        {
            if(event.target.id == this.circularFigures[i].uuid)
            {
                let ref = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
                ref.genome = this.circularFigures[i];
                viewMgr.render();
                return;
            }
        }
    }
}