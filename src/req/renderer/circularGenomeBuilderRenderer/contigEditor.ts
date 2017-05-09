/// <reference types="jquery" />
import * as fs from "fs";
import * as util from "util";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import * as viewMgr from "./../viewMgr";
import * as cf from "./../circularFigure";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";

export class ContigEditor extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public contiguuid : string;
    public contig : cf.Contig;
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
        document.getElementById(this.div).style.display = "block";
    }
    public hide() : void
    {
        let colour : string = (<string>(<any>$(document.getElementById("fillColourPicker"))).minicolors("rgbString"));
        let fontColour : string = (<string>(<any>$(document.getElementById("fontColourPicker"))).minicolors("rgbString"));
        let toggleVisibility = (<HTMLInputElement>document.getElementById("toggleVisibility"));


        let shouldReRender = false;
        if(colour != this.contig.color)
        {
            this.contig.color = colour;
            shouldReRender = true;
        }
        if(fontColour != this.contig.fontFill)
        {
            this.contig.fontFill = fontColour;
            shouldReRender = true;
        }
        if(toggleVisibility.checked == true && this.contig.opacity == 0)
            shouldReRender = true;
        if(toggleVisibility.checked == false && this.contig.opacity == 1)
            shouldReRender = true;
        this.contig.opacity = toggleVisibility.checked ? 1 : 0;

        //Will throw if contig being edited is from the reference file because the elements with these IDs dont get rendered
        try
        {
            let vAdjust : string = (<HTMLInputElement>document.getElementById("vAdjust")).value;
            let start : string = (<HTMLInputElement>document.getElementById("start")).value;
            let end : string  = (<HTMLInputElement>document.getElementById("end")).value;
            if(parseInt(vAdjust) != this.contig.vAdjust)
            {
                this.contig.vAdjust = parseInt(vAdjust);
                shouldReRender = true;
            }
            if(parseInt(start) != this.contig.start)
            {
                this.contig.start = parseInt(start);
                shouldReRender = true;
            }
            if(parseInt(end) != this.contig.end)
            {
                this.contig.end = parseInt(end);
                shouldReRender = true;
            }
        }
        catch(err){}

        document.getElementById(this.div).style.display = "none";
        if(shouldReRender)
            this.forceReRender();
        this.unMount();
    }
    public renderView() : string | undefined
    {
        try
        {
            if(document.getElementById(this.div).style.display == "block" && this.contiguuid)
            {
                let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
                this.genome = genomeView.genome;
                if(this.genome)
                {
                    for(let i = 0; i != this.genome.contigs.length; ++i)
                    {
                        if(this.genome.contigs[i].uuid == this.contiguuid)
                        {
                            this.contig = this.genome.contigs[i];
                            break;
                        }
                    }
                    for(let i = 0; i != this.genome.customContigs.length; ++i)
                    {
                        if(this.genome.customContigs[i].uuid == this.contiguuid)
                        {
                            this.contig = this.genome.customContigs[i];
                            break;
                        }
                    }

                    return `
                        <div class="modalContent">
                            <div class="modalHeader">
                                <span id="closeEditor" class="modalCloseButton">&times;</span>
                                    <h2 id="contigAlias" style="display:inline-block;">${this.contig.alias}</h2>
                                    <input type="text" id="fontColourPicker" data-format="rgb" style="display:inline-block;" value="${this.contig.fontFill}">
                                    <input type="checkbox" id="toggleVisibility" style="display:inline-block;"/>
                                    <p style="display:inline-block;">Visible</p>
                                    <h5>${this.contig.name}</h5>
                            </div>
                            <div class="modalBody">
                                <input type="text" id="fillColourPicker" data-format="rgb" value="${this.contig.color}">
                                ${(()=>{
                                    if(this.contig.allowPositionChange)
                                    {
                                        return `
                                            <input type="text" id="vAdjust" value="${this.contig.vAdjust}">
                                            <input type="text" id="start" value="${this.contig.start}">
                                            <input type="text" id="end" value="${this.contig.end}">
                                        `
                                    }
                                    return " ";
                                })()}
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                            <div class="modalFooter">
                            </div>
                        </div>
                    `;
                }
                return " ";
            }
            else
                return " ";
        }
        catch(err)
        {
            return undefined;
        }
    }
    public postRender() : void
    {
        try
        {
            let colourPicker = document.getElementById("fillColourPicker");
            $(colourPicker).minicolors({
                control : "hue",
                defaultValue : "",
                format : "rgb",
                keywords : "",
                inline : false,
                swatches : [],
                theme : "default",
                change : function(hex : string,opacity : string){}
            });
            let fontColourPicker = document.getElementById("fontColourPicker");
            $(fontColourPicker).minicolors({
                control : "hue",
                defaultValue : "",
                format : "rgb",
                keywords : "",
                inline : false,
                swatches : [],
                theme : "default",
                change : function(hex : string,opacity : string){}
            });
            let toggleVisibility = (<HTMLInputElement>document.getElementById("toggleVisibility"));
            if(this.contig.opacity == 0)
                toggleVisibility.checked = false;
            if(this.contig.opacity == 1)
                toggleVisibility.checked = true;
        }
        catch(err){}
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(event.target.id == "contigAlias")
        {
            let self = this;
            dialogs.prompt("Contig Name",this.contig.alias,function(text : string){
                if(text)
                {
                    self.contig.alias = text;
                    self.forceReRender();
                    
                }
            });
        }
        if(event.target.id == "closeEditor")
        {
            this.hide();
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new ContigEditor("contigEditor",div));
}