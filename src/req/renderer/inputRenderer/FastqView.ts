import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
import Fastq from "./../../fastq";
export class View extends viewMgr.View
{
    public fastqInputs : Array<Fastq>;
    public constructor(div : string)
    {
        super("fastqView",div);
        this.fastqInputs = new Array<Fastq>();
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <img class="topButton activeHover activeHoverButton" id="browseFastqFiles" src="${getReadable("img/browseButton.png")}"><br />
            <div id="fastqTableDiv" style="width:100%;">
                <table style="width:100%;">
                    <tr>
                        <th>Sample Name</th>
                        <th>Path</th>
                        <th>Size</th>
                    </tr>
                    ${(()=>{
                        let res = "";
                        for(let i = 0; i != this.fastqInputs.length; ++i)
                        {
                            res += `
                                <tr class="activeHover ${this.fastqInputs[i].uuid}Class" id="${this.fastqInputs[i].uuid}Row">
                                    <td class="${this.fastqInputs[i].uuid}Class">${this.fastqInputs[i].alias}</td>
                                    <td class="${this.fastqInputs[i].uuid}Class">${this.fastqInputs[i].imported ? "In Project" : this.fastqInputs[i].path}</td>
                                    <td class="${this.fastqInputs[i].uuid}Class">${this.fastqInputs[i].sizeString}</td>
                                </tr>
                            `;
                        }
                        return res;
                    })()}
                </table>
                <img src="${getReadable("img/import.png")}" class="activeHover activeHoverButton" id="importSelectedFastqs" />
            </div>
        `;
    }
    public postRender() : void
    {
        for(let i = 0; i != this.fastqInputs.length; ++i)
        {
            let row = document.getElementById(`${this.fastqInputs[i].uuid}Row`);
            if(this.fastqInputs[i].checked)
                row.classList.add("selected");
            else
                row.classList.remove("selected");
        }
    }
    public divClickEvents(event : JQueryEventObject) : void
    {
        console.log(event.target);
    }
    public dataChanged() : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
