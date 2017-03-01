//// <reference path="jquery.d.ts" />

import * as viewMgr from "./../viewMgr";
import {DataModelMgr} from "./../model";
import {FastaContigLoader,Contig} from "./../circularGenome/fastaContigLoader";
import {CircularGenomeMgr,CircularFigure,} from "./../circularGenomeMgr";

import * as GenomeView from "./genomeView";
export function addView(arr : Array<viewMgr.View>,div : string,model : CircularGenomeMgr)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            public views : Array<viewMgr.View>;
            public firstRender : boolean;
            public leftPanelOpen : boolean;
            public rightPanelOpen : boolean;
            public circularGenomes : any;
            public genomeWriters : any;
            public circularGenomeMgr : CircularGenomeMgr;
            public fastaInputs : any;
            public constructor()
            {
                super("masterView",div,model);
                this.views = new Array<viewMgr.View>();
                this.firstRender = true;
                this.leftPanelOpen = false;
                this.rightPanelOpen = false;
                this.circularGenomes = new Array<any>();
                this.genomeWriters = new Array<any>();
                this.circularGenomeMgr = model;
            }
            public onMount() : void
            {
                GenomeView.addView(this.views,"genomeView",undefined);
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
                                        if(this.fastaInputs[i].checked)
                                        {
                                            res += `<div id ="${this.fastaInputs[i].validID}">
                                                        <h3>${this.fastaInputs[i].alias}</h3>
                                                        <button id="${this.fastaInputs[i].validID}_newFigure" style="float:right;">New Figure</button>
                                                `;
                                            for(let k = 0; k != this.circularGenomeMgr.managedFastas.length; ++k)
                                            {
                                                if(this.circularGenomeMgr.managedFastas[k].name == this.fastaInputs[i].name)
                                                {
                                                    for(let j = 0; j != this.circularGenomeMgr.managedFastas[k].circularFigures.length; ++j)
                                                    {
                                                        res += `<input type="radio" id="${j}" name="selectedFigure" /><p>${this.circularGenomeMgr.managedFastas[k].circularFigures[j].name}</p>`;
                                                    }
                                                    break;
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
            }
            public postRender() : void{}
            public dataChanged() : void
            {
                this.firstRender = true;
                for(let i = 0; i != this.fastaInputs.length; ++i)
                {
                    if(!this.circularGenomeMgr.isCached(this.fastaInputs[i]))
                        this.circularGenomeMgr.cacheFasta(this.fastaInputs[i]);
                }
            }
            public doneLoadingContig(genomeIndex : number) : void
            {
                let ref = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
                ref.genome = this.genomeWriters[genomeIndex];
                this.render();
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
                                }
                            )()
                        }
                    );
                }
                if(this.fastaInputs)
                {
                    for(let i = 0; i != this.fastaInputs.length; ++i)
                    {
                        if(event.target.id == this.fastaInputs[i].validID+"_newFigure")
                        {
                            if(this.circularGenomeMgr.isCached(this.fastaInputs[i]))
                            {
                                for(let k = 0; k != this.circularGenomeMgr.managedFastas.length; ++k)
                                {
                                    if(this.circularGenomeMgr.managedFastas[k].name == this.fastaInputs[i].name)
                                    {
                                        this.circularGenomeMgr.managedFastas[k].circularFigures.push
                                        (
                                            new CircularFigure("New Figure",this.circularGenomeMgr.managedFastas[i].contigs)
                                        );
                                        this.circularGenomeMgr.postManagedFastas();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
                let parentID = event.target.parentElement.id;
                for(let i = 0; i != this.circularGenomeMgr.managedFastas.length; ++i)
                {
                    if(this.circularGenomeMgr.managedFastas[i].validID == parentID)
                    {
                        let ref = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
                        ref.genome = this.circularGenomeMgr.managedFastas[i].circularFigures[<any>event.target.id];
                        viewMgr.render();
                        return;
                    }
                }
            }
        }
    );
}