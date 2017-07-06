import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
export class View extends viewMgr.View
{
    public searchFilter : RegExp;
    public filterString : string;
    public constructor(div : string)
    {
        super("fastqView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
            <img class="topButton activeHover" src="${getReadable("img/browseButton.png")}">
            <h5>Read Files</h5>
            <table style="width:100%;">
                <tr>
                    <th>Sample Name</th>
                    <th>Path</th>
                    <th>Size</th>
                </tr>
            </table>
        `;
    }
    public postRender() : void
    {

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
