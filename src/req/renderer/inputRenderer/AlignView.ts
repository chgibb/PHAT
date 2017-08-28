import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
import {AlignData} from "./../../alignData";
export class View extends viewMgr.View
{
    public aligns : Array<AlignData>;
    public constructor(div : string)
    {
        super("alignView",div);
        this.aligns = new Array<AlignData>();
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
        <img class="topButton activeHover activeHoverButton" id="browseAlignFiles" src="${getReadable("img/browseButton.png")}"><br />
        <p id="loadingText"></p>
        <div id="alignTableDiv" style="width:100%;">
        <table style="width:100%;">
            <tr>
                <th>File Name</th>
                <th>Size</th>
                <th>Ref Seq</th>
            </tr>
            ${(()=>{
                let res = "";
                if(!this.aligns)
                    return "";
                for(let i = 0; i != this.aligns.length; ++i)
                {
                    if(this.aligns[i].isExternalAlignment)
                    {
                        res += `
                            <tr>
                                <td>${this.aligns[i].alias}</td>
                                <td>${this.aligns[i].sizeString ? this.aligns[i].sizeString : "Unknown"}</td>
                                <td ${this.aligns[i].fasta ? "" : `id="${this.aligns[i].uuid}LinkRef" class="activeHover"`}>${this.aligns[i].fasta ? this.aligns[i].fasta.alias : "Not Linked"}</td>
                            </tr>
                        `;
                    }
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