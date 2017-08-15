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
                <h5 style="margin-bottom:0px;">Reference Sequence Files</h5>
            </div>
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
                                <tr class="activeHover ${this.fastaInputs[i].uuid}Class" id="${this.fastaInputs[i].uuid}Row">
                                    <td class="${this.fastaInputs[i].uuid}Class">${this.fastaInputs[i].alias}</td>
                                    <td class="${this.fastaInputs[i].uuid}Class">${this.fastaInputs[i].imported ? "In Project" : this.fastaInputs[i].path}</td>
                                    <td class="${this.fastaInputs[i].uuid}Class">${this.fastaInputs[i].sizeString}</td>
                                    <td class="${this.fastaInputs[i].uuid}Class" id="${this.fastaInputs[i].uuid}Index">${this.fastaInputs[i].indexed != false ? `<img src="${getReadable("img/pass.png")}">` : "Not Indexed"}</td>
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
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            let row = document.getElementById(`${this.fastaInputs[i].uuid}Row`);
            if(this.fastaInputs[i].checked)
                row.classList.add("selected");
            else
                row.classList.remove("selected");
        }
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
