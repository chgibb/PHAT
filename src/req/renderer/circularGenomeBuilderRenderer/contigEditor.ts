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
        if(colour != this.contig.color)
        {
            this.contig.color = colour;
            this.forceReRender();
        }
        this.unMount();
        document.getElementById(this.div).style.display = "none";
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

                    return `
                        <div class="modalContent">
                            <div class="modalHeader">
                                <span id="closeEditor" class="modalCloseButton">&times;</span>
                                    <h2 id="contigAlias">${this.contig.alias}</h2>
                                    <h5>${this.contig.name}</h5>
                            </div>
                            <div class="modalBody">
                                <input type="text" id="fillColourPicker" data-format="rgb" value="${this.contig.color}">
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