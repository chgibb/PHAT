import * as viewMgr from "./../viewMgr";
import {AlignData} from "./../../alignData";
export class View extends viewMgr.View
{
    public constructor(div : string)
    {
        super("alignView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `
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