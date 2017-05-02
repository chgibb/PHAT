import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";

import * as selectAlignment from "./rightPanel/selectAlignment";
import * as selectCoverageTracks from "./rightPanel/selectCoverageTracks";
import * as noReference from "./rightPanel/noReference";
import * as noCoverage from "./rightPanel/noCoverage";
import {GenomeView} from "./genomeView";
import alignData from "./../../alignData";
import * as cf from "./../circularFigure";

export class RightPanel extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public alignData : Array<alignData>;
    public selectedAlignment : alignData;
    public views : Array<viewMgr.View>;
    public constructor(name : string,div : string)
    {
        super(name,div);
        this.views = new Array<viewMgr.View>();
        selectAlignment.addView(this.views,this.div+"View");
        selectCoverageTracks.addView(this.views,this.div+"View");
        noReference.addView(this.views,this.div+"View");
        noCoverage.addView(this.views,this.div)+"View";
    }
    public unMountChildren() : void
    {
        for(let i : number = 0; i != this.views.length; ++i)
        {
            this.views[i].unMount();
        }
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        this.unMountChildren();
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let genomeView = <GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
        let idx = -1;
        if(!genomeView.genome)
            idx = viewMgr.getIndexOfViewByName("noReference",this.views);
        else if(!this.alignData)
            idx = viewMgr.getIndexOfViewByName("noCoverage",this.views);
        else if(this.alignData)
        {
            idx = viewMgr.getIndexOfViewByName("selectAlignment",this.views);
            (<selectAlignment.SelectAlignment>this.views[idx]).alignData = this.alignData;
        }
        if(this.selectedAlignment)
        {
            idx = viewMgr.getIndexOfViewByName("selectCoverageTracks",this.views);
        }

        this.views[idx].mount();
        this.views[idx].render();
        return undefined;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new RightPanel("rightPanel",div));
}