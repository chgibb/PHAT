import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
export class View extends viewMgr.View
{
    public searchFilter : RegExp;
    public filterString : string;
    public constructor(div : string)
    {
        super("fastaView",div);
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
