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
    public show() : void
    {
        this.mount();
        document.getElementById(this.div).style.display = "block";
    }
    public hide() : void
    {
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
                                <p>Some text in the Modal Body</p>
                                <p>Some other text...</p>
                            </div>
                            <div class="modalFooter">
                                <h3>Modal Footer</h3>
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
    public postRender() : void{}
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
                    cf.cacheBaseFigure(self.genome);
                    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                    let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
                    genomeView.firstRender = true;
                    masterView.dataChanged();
                    viewMgr.render();
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