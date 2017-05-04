import * as fs from "fs";
import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../../atomicOperationsIPC";
import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import {GenomeView} from "./../genomeView";
import {RightPanel} from "./../rightPanel";
import alignData from "./../../../alignData";
import * as cf from "./../../circularFigure";

require("@claviska/jquery-minicolors");
export class SelectCoverageTracks extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public selectedAlignment : alignData;
    public constructor(name : string,div : string)
    {
        super(name,div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
        let rightPanel = <RightPanel>viewMgr.getViewByName("rightPanel",masterView.views);
        this.genome = genomeView.genome;
        this.selectedAlignment = rightPanel.selectedAlignment;
        let res =  `
            <button id="goBack">Go Back</button>
            ${(()=>{
                let res = `<h2>Available Tracks</h2>`;
                if(this.genome.renderedCoverageTracks.length >= 1)
                {
                    for(let i = 0; i != this.genome.renderedCoverageTracks.length; ++i)
                    {
                        for(let k = 0; k != this.genome.contigs.length; ++k)
                        {
                            if(this.genome.renderedCoverageTracks[i].uuidContig == this.genome.contigs[k].uuid && this.genome.renderedCoverageTracks[i].uuidAlign == this.selectedAlignment.uuid)
                            {
                                res += `<div><input style="display:inline-block;" type="checkbox" id="${this.genome.renderedCoverageTracks[i].uuid}" /><h3 style="display:inline-block;color:${this.genome.renderedCoverageTracks[i].colour}">${this.genome.contigs[k].name}</h3></div>`;
                            }
                        }
                    }
                    return res;
                }
                return "";
            })()}
        `;
        res += `<input type="text" id="colourPicker" data-format="rgb" value="rgb(0, 0, 0)">`;
        res += `
            ${(()=>{
                let res = ""
                for(let i = 0; i != this.genome.contigs.length; ++i)
                {
                    if(this.genome.contigs[i].uuid != "filler")
                    {
                        res += `<div><p style="display:inline-block;">${this.genome.contigs[i].name}</p><input style="display:inline-block;" type="button" id="${this.genome.contigs[i].uuid}" value="Generate Visualization" /></div>`;
                    }
                }
                return res;
            })()}
        `;

        return res;
    }
    public postRender() : void
    {
        let colourPicker = document.getElementById("colourPicker");
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
        for(let i = 0; i != this.genome.renderedCoverageTracks.length; ++i)
        {
            if(this.genome.renderedCoverageTracks[i].checked)
            {
                try
                {
                    (<HTMLInputElement>document.getElementById(this.genome.renderedCoverageTracks[i].uuid)).checked = true;
                }
                catch(err){}
            }
        }
    }
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(!event.target.id)
            return;
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
        let rightPanel = <RightPanel>viewMgr.getViewByName("rightPanel",masterView.views);

        if(event.target.id == "goBack")
        {
            rightPanel.selectedAlignment = undefined;
            viewMgr.render();
        }

        for(let i = 0; i != this.genome.contigs.length; ++i)
        {
            if(this.genome.contigs[i].uuid == event.target.id)
            {
                masterView.dataChanged(); 
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "renderCoverageTrackForContig",
                        figureuuid : this.genome.uuid,
                        alignuuid : this.selectedAlignment.uuid,
                        uuid : event.target.id,
                        colour : (<string>(<any>$(document.getElementById("colourPicker"))).minicolors("rgbString"))
                    }
                );
                break;
            }
        }
        let rebuildTracks = false;
        for(let i = 0; i != this.genome.renderedCoverageTracks.length; ++i)
        {
            if(this.genome.renderedCoverageTracks[i].uuid == event.target.id)
            {
                this.genome.renderedCoverageTracks[i].checked = (<HTMLInputElement>document.getElementById(event.target.id)).checked;
                rebuildTracks = true;
                break;
            }
        }
        if(rebuildTracks)
        {
            genomeView.firstRender = true;
            viewMgr.render();
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new SelectCoverageTracks("selectCoverageTracks",div));
}