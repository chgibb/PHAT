/// <reference types="jquery" />

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {SaveKeyEvent} from "./../../ipcEvents";
import * as viewMgr from "./../viewMgr";
import {CircularFigure,} from "./../circularFigure";
import {Fasta} from "./../../fasta";

import * as GenomeView from "./genomeView";

import * as $ from "jquery";
(<any>window).$ = $;
(<any>window).jQuery = $;
(<any>window).Tether = require("tether");
require("bootstrap");
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public circularFigures : Array<CircularFigure>;
    public fastaInputs : Array<Fasta>;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.circularFigures = new Array<CircularFigure>();
        this.fastaInputs = new Array<Fasta>();
    }
    public showModal() : void
    {
        (<any>$(".modal")).modal("show");
        document.getElementsByClassName("modal-backdrop")[0].classList.remove("modal-backdrop");
    }
    public setSelectedFigureInDropDown() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(!genomeView.genome)
            return;
        for(let i = 0; i != this.circularFigures.length; ++i)
        {
            if(genomeView.genome.uuid == this.circularFigures[i].uuid)
            {
                document.getElementById(`${this.circularFigures[i].uuid}Open`).classList.add("selectedFigureInDropDown");
            }
        }
    }
    public setFigureRadiusInInput() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(!genomeView.genome)
            return;
        (<HTMLInputElement>document.getElementById("figureRadiusInput")).value = genomeView.genome.radius.toString();
    }
    public setFigureBPIntervalInput() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(!genomeView.genome)
            return;
        (<HTMLInputElement>document.getElementById("figureBPIntervalInput")).value = genomeView.genome.circularFigureBPTrackOptions.interval.toString();
    }
    public setShowBPIntervalCheckBox() : void
    {
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        if(!genomeView.genome)
            return;
        let checkbox = (<HTMLInputElement>document.getElementById("showBPIntervalCheckBox"));
        if(genomeView.genome.circularFigureBPTrackOptions.showLabels == 0)
            checkbox.checked = false;
        else if(genomeView.genome.circularFigureBPTrackOptions.showLabels == 1)
            checkbox.checked = true;
    }
    public onMount() : void
    {
        GenomeView.addView(this.views,"genomeView");
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].onMount();
        }
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);
        let self = this;
        window.onbeforeunload = function(e){
            self.dataChanged();
        }
        document.getElementById("figures").onclick = function(this : HTMLElement,ev : MouseEvent){
            for(let i = 0; i != self.fastaInputs.length; ++i)
            {
                if((<any>ev.target).id == `${self.fastaInputs[i].uuid}NewFigure`)
                {
                    self.circularFigures.push(new CircularFigure(
                        "New Figure",
                        self.fastaInputs[i].uuid,
                        self.fastaInputs[i].contigs
                    ));
                    self.dataChanged();
                    genomeView.genome = self.circularFigures[self.circularFigures.length - 1];
                    genomeView.firstRender = true;
                    viewMgr.render();
                    self.setSelectedFigureInDropDown();
                    return;
                }
            }
            for(let i = 0; i != self.circularFigures.length; ++i)
            {
                if((<any>ev.target).id == `${self.circularFigures[i].uuid}Open`)
                {
                    genomeView.genome = self.circularFigures[i];
                    genomeView.firstRender = true;
                    viewMgr.render();
                    self.setSelectedFigureInDropDown();
                    return;
                }
            }
        }
        document.getElementById("showBPIntervalCheckBox").onclick = function(this : HTMLElement,ev : MouseEvent){
            document.getElementById("updateNavBarButton").click();
        }

        document.getElementById("openModalAligns").onclick = function(this : HTMLElement,ev : MouseEvent){
            self.showModal();
        }

        document.getElementById("updateNavBarButton").onclick = function(this : HTMLElement,ev : MouseEvent){
            let radius = parseInt((<HTMLInputElement>document.getElementById("figureRadiusInput")).value);
            if(radius)
                genomeView.genome.radius = radius;

            let trackInterval = parseInt((<HTMLInputElement>document.getElementById("figureBPIntervalInput")).value);
            if(radius)
                genomeView.genome.circularFigureBPTrackOptions.interval = trackInterval;

            let showInterval = ((<HTMLInputElement>document.getElementById("showBPIntervalCheckBox")).checked);
            if(showInterval !== undefined)
            {
                if(showInterval === true)
                    genomeView.genome.circularFigureBPTrackOptions.showLabels = 1;
                else
                    genomeView.genome.circularFigureBPTrackOptions.showLabels = 0;
            }
            
            viewMgr.render();
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
        let res = "";
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(this.fastaInputs[i].checked && this.fastaInputs[i].indexed)
            {
                res += `
                    <li><b>${this.fastaInputs[i].alias}</b></li>
                    <li role="separator" class="divider"></li>
                    <li><i><a id="${this.fastaInputs[i].uuid}NewFigure" href="#">New Figure</a></i></li>
                    <li role="separator" class="divider"></li>
                `;
                for(let j = 0; j != this.circularFigures.length; ++j)
                {
                    if(this.circularFigures[j].uuidFasta == this.fastaInputs[i].uuid)
                    {
                        res += `
                            <li><a id="${this.circularFigures[j].uuid}Open"href="#">${this.circularFigures[j].name}</a></li>
                        `;
                    }
                }
                res += `<li role="separator" class="divider"></li>`;
            }
        }
        document.getElementById("figures").innerHTML = res;
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
        this.setSelectedFigureInDropDown();
        this.setFigureRadiusInInput();
        this.setFigureBPIntervalInput();
        this.setShowBPIntervalCheckBox();
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
        let genomeView = <GenomeView.GenomeView>viewMgr.getViewByName("genomeView",this.views);        
    }
}