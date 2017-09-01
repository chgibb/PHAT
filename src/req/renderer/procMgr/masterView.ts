import * as viewMgr from "./../viewMgr";
import * as procView from "./procView";
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
    }
    public onMount() : void
    {
        procView.addView(this.views,"view");
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        return ``;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
