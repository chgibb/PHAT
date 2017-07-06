import * as viewMgr from "./../viewMgr";
import * as fastqView from "./FastqView";
import * as fastaView from "./FastaView";
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender : boolean;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.firstRender = true;
    }
    public onMount() : void
    {
        fastqView.addView(this.views,"fastqView");
        fastaView.addView(this.views,"fastaView");
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.firstRender = false;
            return `
                <div id="fastqView" style="width:50%">
                </div>
                <div id="fastaView" style="width:50%">
                </div>
            `;
        }
        else
        {
            for(let i = 0; i != this.views.length; ++i)
                this.views[i].render();
            return undefined;
        }
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
