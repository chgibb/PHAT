import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import {GenomeView} from "./../genomeView";
import alignData from "./../../../alignData";
import * as cf from "./../../circularFigure";

export class SelectAlignment extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public alignData : Array<alignData>;
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
        this.genome = genomeView.genome;
        return ` 
            <h1>Coverage Options</h1>
            ${(()=>{
                let res : string = "";
                if(this.alignData)
                {
                    for(let i : number = 0; i != this.alignData.length; ++i)
                    {
                        if(this.alignData[i].fasta.uuid == genomeView.genome.uuidFasta)
                        {
                            res += `<h3>${this.alignData[i].alias}`;
                        }
                    }
                }
                return " ";
            })()}
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new SelectAlignment("selectAlignment",div));
}