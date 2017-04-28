import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";
import alignData from "./../../alignData";
import * as cf from "./../circularFigure";

export class RightPanel extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public alignData : Array<alignData>;
    public constructor(name : string,div : string)
    {
        super(name,div);
    }
    public onMount() : void{console.log("Called onmount");}
    public onUnMount() : void{}
    public renderView() : string
    {
        console.log("called render panel");
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
        if(!genomeView.genome)
        {
            return `
                <h3>Select a reference from the left to view coverage visualization options</h3>
            `;
        }
        this.genome = genomeView.genome;
        let noCoverageMessage = `<h3>Run alignments with this reference to generate coverage data to visualize</h3>`;
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
                    if(!res)
                        return noCoverageMessage;
                    else
                        return res;
                }
                else if(!this.alignData)
                {
                    return noCoverageMessage;
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
    arr.push(new RightPanel("rightPanel",div));
}