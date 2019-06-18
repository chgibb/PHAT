import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
import {Fasta} from "./../../fasta";
import {AlignData} from "./../../alignData";
import {getLinkableRefSeqs,LinkableRefSeq} from "./../../getLinkableRefSeqs";

export class View extends viewMgr.View
{
    public inspectingAlign : AlignData;
    public fastaInputs : Array<Fasta>;
    public linkableRefSeqs : Array<LinkableRefSeq>;
    public shouldAllowTriggeringOps : boolean;
    public constructor(div : string)
    {
        super("linkRefView",div);
        this.fastaInputs = new Array<Fasta>();
        this.linkableRefSeqs = new Array<LinkableRefSeq>();
        this.shouldAllowTriggeringOps = true;
    }
    public onMount() : void
    {
        this.linkableRefSeqs = getLinkableRefSeqs(this.fastaInputs,this.inspectingAlign);
    }
    public onUnMount() : void
    {}
    public renderView() : string
    {
        return `
            <img class="topButton activeHover activeHoverButton" id="linkRefViewGoBackAlignView" src="${getReadable("img/GoBack.png")}"><br />
            <br />
            <br />
            <p>Potentially Compatible References</p>
            <div id="compatibleRefsTableDiv" style="width:100%">
                <table style="width:100%">
                    <tr>
                        <th>File Name</th>
                        <th>Size</th>
                        <th>Link This Ref</th>
                    </tr>
                    ${(()=>
    {
        let res = "";
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            let fasta = this.fastaInputs[i];
            for(let k = 0; k != this.linkableRefSeqs.length; ++k)
            {
                if(this.linkableRefSeqs[k].linkable && fasta.uuid == this.linkableRefSeqs[k].uuid)
                {
                    res += `
                                        <tr>
                                            <th>${fasta.alias}</th>
                                            <th>${fasta.sizeString}</th>
                                            ${(()=>
        {
            if(this.shouldAllowTriggeringOps)
            {
                return `
                                                        <th id="${fasta.uuid}Link" class="activeHover">Link to ${this.inspectingAlign.alias}</th>
                                                    `;
            }
            else
            {
                return `
                                                        <td><div class="three-quarters-loader"></div></td>
                                                    `;
            }
        })()}
                                        </tr>
                                    `;
                }
            }
        }
        return res;
    })()}
                </table>
            </div>
            <br />
            <br />
            <p>Incompatible References</p>
            <div id="incompatibleRefsTableDiv" style="width:100%">
                <table style="width:100%">
                    <tr>
                        <th>File Name</th>
                        <th>Size</th>
                        <th>Reason</th>
                    </tr>
                    ${(()=>
    {
        let res = "";
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            let fasta = this.fastaInputs[i];
            for(let k = 0; k != this.linkableRefSeqs.length; ++k)
            {
                if(!this.linkableRefSeqs[k].linkable && fasta.uuid == this.linkableRefSeqs[k].uuid)
                {
                    res += `
                                        <tr>
                                            <th>${fasta.alias}</th>
                                            <th>${fasta.sizeString}</th>
                                            <th id="${fasta.uuid}LongReason" class="activeHover">${this.linkableRefSeqs[k].reason}</th>
                                        </tr>
                                    `;
                }
            }
        }
        return res;
    })()}
                </table>
            </div>
        `;
    }
    public postRender() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {}
    public dataChanged() : void
    {}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}