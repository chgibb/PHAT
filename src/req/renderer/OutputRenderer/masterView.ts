import * as viewMgr from "./../viewMgr";
import * as rightPanel from "./rightPanel";

import Fastq from "./../../fastq"
import {Fasta} from "./../../fasta";
import alignData from "./../../alignData";

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender = true;
    public rightPanelOpen = false;
    public alignData : Array<alignData>;
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;

    public displayInfo : "QCInfo" | "RefSeqInfo" | "AlignmentInfo";
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.displayInfo = "QCInfo";
    }
    public onMount() : void
    {
        rightPanel.addView(this.views,"rightSlideOutPanelView");
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].onMount();
        }
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.rightPanelOpen = false;
            this.firstRender = false;
            return `
                <button id="rightPanel" class="rightSlideOutPanel">Options</button>
                <div id="rightSlideOutPanel" class="rightSlideOutPanel">
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
        let self = this;
        console.log(event.target.id);
        if(event.target.id == "rightPanel")
        {
            $("#rightSlideOutPanel").animate
            (
                {
                    "margin-right" : 
                    (
                        function()
                        {
                            if(!self.rightPanelOpen)
                            {
                                self.rightPanelOpen = true;
                                return "+=50%";
                            }
                            if(self.rightPanelOpen)
                            {
                                self.rightPanelOpen = false;
                                return "-=50%";
                            }
                            return "";
                        }
                    )()
                }
            );
        }
    }
}