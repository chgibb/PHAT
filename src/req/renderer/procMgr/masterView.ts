import * as viewMgr from "./../viewMgr";
import * as procView from "./procView";
import {PIDInfo} from "./../../PIDInfo";
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>
    public pids : Array<PIDInfo>;
    public currentView : "procView";
    public firstRender : boolean;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.pids = new Array<PIDInfo>();
        this.currentView = "procView";
        this.firstRender = true;
    }
    public onMount() : void
    {
        procView.addView(this.views,"procView");
    }
    public onUnMount() : void
    {}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.firstRender = false;
            return `
                <div id="procView" style="width:100%">
                </div>
            `;
        }
        else
        {
            let idx = viewMgr.getIndexOfViewByName(this.currentView,this.views);
            this.views[idx].render();
            return undefined;
        }
    }
    public postRender() : void
    {}
    public dataChanged() : void
    {
        let procView = <procView.View>viewMgr.getViewByName("procView",this.views);
        procView.pids = this.pids;
    }
    public divClickEvents(event : JQueryEventObject) : void
    {}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
