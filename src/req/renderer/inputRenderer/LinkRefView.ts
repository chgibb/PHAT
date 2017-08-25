import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
import {Fasta} from "./../../fasta";
import {AlignData} from "./../../alignData";
import {getLinkableRefSeqs} from "./../../getLinkableRefSeqs";

export class View extends viewMgr.View
{
    public inspectingAlign : AlignData;
    public fastaInputs : Array<Fasta>;
    public constructor(div : string)
    {
        super("linkRefView",div);
        this.fastaInputs = new Array<Fasta>();
    }
    public onMount() : void
    {
        console.log(getLinkableRefSeqs(this.fastaInputs,this.inspectingAlign));
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <img class="topButton activeHover activeHoverButton" id="linkRefViewGoBackAlignView" src="${getReadable("img/GoBack.png")}"><br />
            <div id="compatibleRefsTableDiv" style="width:100%">
                <table style="width:100%">
                    <tr>
                        <th>File Name</th>
                        <th>Size</th>
                        <th>Link This Ref</th>
                    </tr>
                    ${(()=>{
                        let res = "";
                        for(let i = 0; i != this.fastaInputs.length; ++i)
                        {
                            res += `

                            `;
                        }
                        return res;
                    })()}
                </table>
            </div>
        `;
    }
    public postRender() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
    public dataChanged() : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}