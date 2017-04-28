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
        return `
            <h2>Available Tracks</h2>
            ${(()=>{
                let res = "";
                for(let i = 0; i != this.genome.renderedCoverageTracks.length; ++i)
                {
                    for(let k = 0; k != this.genome.contigs.length; ++k)
                    {
                        if(this.genome.renderedCoverageTracks[i].uuidContig == this.genome.contigs[k].uuid)
                        {
                            res += `<input type="checkbox" id="${this.genome.renderedCoverageTracks[i].path}" /><h3>${this.genome.contigs[k].name}</h3>`;
                        }
                    }
                }
            })()}
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new SelectCoverageTracks("selectCoverageTracks",div));
}