import * as fs from "fs";
import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import {GenomeView} from "./../genomeView";
import {RightPanel} from "./../rightPanel";
import alignData from "./../../../alignData";
import * as cf from "./../../circularFigure";

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
            ${(()=>{
                let res = `<h2>Available Tracks</h2>`;
                if(this.genome.renderedCoverageTracks.length >= 1)
                {
                    for(let i = 0; i != this.genome.renderedCoverageTracks.length; ++i)
                    {
                        for(let k = 0; k != this.genome.contigs.length; ++k)
                        {
                            if(this.genome.renderedCoverageTracks[i].uuidContig == this.genome.contigs[k].uuid)
                            {
                                res += `<input type="checkbox" id="${this.genome.renderedCoverageTracks[i].uuid}" /><h3>${this.genome.contigs[k].name}</h3>`;
                            }
                        }
                    }
                    return res;
                }
                return "";
            })()}
        `;
        res += `
            ${(()=>{
                let res = ""
                for(let i = 0; i != this.genome.contigs.length; ++i)
                {
                    if(this.genome.contigs[i].uuid != "filler")
                    {
                        let shouldRender = true;
                        for(let k = 0; k != this.genome.renderedCoverageTracks.length; ++k)
                        {
                            if(this.genome.renderedCoverageTracks[k].uuidContig == this.genome.contigs[i].uuid)
                            {
                                shouldRender = false;
                                break;
                            }
                        }
                        if(shouldRender)
                        {
                            res += `<p>${this.genome.contigs[i].name}</p><input type="button" id="${this.genome.contigs[i].uuid}" value="Generate Visualization" />`;
                        }
                    }
                }
                return res;
            })()}
        `;

        return res;
    }
    public postRender() : void
    {
        for(let i = 0; i != this.genome.renderedCoverageTracks.length; ++i)
        {
            if(this.genome.renderedCoverageTracks[i].checked)
            {
                (<HTMLInputElement>document.getElementById(this.genome.renderedCoverageTracks[i].uuid)).checked = true;
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
        for(let i = 0; i != this.genome.contigs.length; ++i)
        {
            if(this.genome.contigs[i].uuid == event.target.id)
            {
                cf.cacheCoverageTracks(
                    this.genome,
                    this.genome.contigs[i].uuid,
                    this.selectedAlignment,
                    function(status : boolean,coverageTracks : string)
                    {
                        viewMgr.render();
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