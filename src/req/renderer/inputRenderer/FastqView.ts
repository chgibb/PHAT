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
            <img class="topButton activeHover" id="browseFastqFiles" src="${getReadable("img/browseButton.png")}">
            <h5>Read Files</h5>
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
                            <tr>
                                <td>${this.fastqInputs[i].alias}</td>
                                <td>${this.fastqInputs[i].path}</td>
                                <td>${this.fastqInputs[i].sizeString}</td>
                            </tr>
                        `;
                    }
                    return res;
                })()}
            </table>
        `;
    }
    public postRender() : void
    {

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
