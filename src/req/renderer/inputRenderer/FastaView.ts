import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
import {Fasta} from "./../../fasta";
export class View extends viewMgr.View
{
    public fastaInputs : Array<Fasta>;
    public shouldAllowTriggeringOps : boolean;
    public constructor(div : string)
    {
        super("fastaView",div);
        this.fastaInputs = new Array<Fasta>();
        this.shouldAllowTriggeringOps = true;
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <img class="topButton activeHover activeHoverButton" id="browseFastaFiles" src="${getReadable("img/browseButton.png")}"><br />
            <div id="fastaTableDiv" style="width:100%;">
                <table style="width:100%;">
                    <tr>
                        <th>Reference Name</th>
                        <th>Directory</th>
                        <th>Size</th>
                        <th>Ready for Visualization</th>
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
                                `;

                            if(this.fastaInputs[i].indexedForVisualization)
                            {
                                res += `<td class="cellHover ${this.fastaInputs[i].uuid}Class" id="${this.fastaInputs[i].uuid}IndexForVisualization"><img src="${getReadable("img/pass.png")}"></td>`;
                            }
                            else if(this.shouldAllowTriggeringOps)
                            {
                                res += `<td class="cellHover ${this.fastaInputs[i].uuid}Class" id="${this.fastaInputs[i].uuid}IndexForVisualization">Not Ready</td>`;
                            }
                            else if(!this.shouldAllowTriggeringOps)
                            {
                                res += `<td><div class="three-quarters-loader"></div></td>`;
                            }
                            res += `</tr>`;
                        }
                        return res;
                    })()}
                </table>
                ${this.fastaInputs.length > 0 ? `<img src="${getReadable("img/import.png")}" class="activeHover activeHoverButton" id="importSelectedFastas" />` : ""}
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
