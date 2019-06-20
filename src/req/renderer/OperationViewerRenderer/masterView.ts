import * as viewMgr from "./../viewMgr";
import * as runningView from "./runningView";
import * as logView from "./logView";
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
    }
    public onMount() : void
    {
        runningView.addView(this.views,"runningView");
        logView.addView(this.views,"logView");
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].mount();
        }
    }
    public onUnMount() : void
    {
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].unMount();
        }
    }
    public renderView() : string
    {
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].render();
        }
        this.postRender();
        return undefined;
    }
    public postRender() : void
    {
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].postRender();
        }
    }
    public dataChanged() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}