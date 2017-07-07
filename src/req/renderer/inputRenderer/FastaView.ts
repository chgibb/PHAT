import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
import {Fasta} from "./../../fasta";
export class View extends viewMgr.View
{
    public fastaInputs : Array<Fasta>;
    public constructor(div : string)
    {
        super("fastaView",div);
        this.fastaInputs = new Array<Fasta>();
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <div style="float:left;">
                <h5>Reference Sequence Files</h5>
                <img class="topButton activeHover" id="browseFastaFiles" src="${getReadable("img/browseButton.png")}">
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div id="fastaTableDiv" style="overflow-y:scroll;">
                <table style="width:100%;">
                    <tr>
                        <th>Reference Name</th>
                        <th>Directory</th>
                        <th>Size</th>
                        <th>Indexed</th>
                    </tr>
                    ${(()=>{
                        let res = "";
                        for(let i = 0; i != this.fastaInputs.length; ++i)
                        {
                            res += `
                                <tr>
                                    <td>${this.fastaInputs[i].alias}</td>
                                    <td>${this.fastaInputs[i].path}</td>
                                    <td>${this.fastaInputs[i].sizeString}</td>
                                </tr>
                            `;
                        }
                        return res;
                    })()}
                </table>
            </div>
        `;
    }
    public postRender() : void
    {
        $("#fastaTableDiv").css("height",$(`#${this.div}`).height()/2+"px");
    }
    public divClickEvents(event : JQueryEventObject) : void
    {

    }
    public dataChanged() : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
