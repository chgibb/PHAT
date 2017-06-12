import * as viewMgr from "./../viewMgr";

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender = true;
    public rightPanelOpen = false;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
    }
    public onMount() : void
    {

    }
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.rightPanelOpen = false;
            return `
                <button id="rightPanel" class="rightSlideOutPanel">Options</button>
                <div id="rightSlideOutPanel class="rightSlideOutPanel">
                    <div id="rightSlideOutPanelView">
                    </div>
                <div id="reportView">
                </div>
            `;
        }
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

    public dataChanged() : void{}

    public divClickEvents(event : JQueryEventObject) : void
    {

    }
}