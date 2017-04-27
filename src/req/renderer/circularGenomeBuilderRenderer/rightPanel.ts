import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import alignData from "./../../alignData";
import {CircularFigure,renderBaseFigure,getBaseFigureFromCache,renderCoverageTracks} from "./../circularFigure";

export class RightPanel extends viewMgr.View
{
    public constructor(name : string,div : string)
    {
        super(name,div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return ` `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new RightPanel("rightPanel",div));
}