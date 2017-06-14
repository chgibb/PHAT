import * as viewMgr from "./../viewMgr";
import * as rightPanel from "./rightPanel";
import * as reportView from "./reportView";

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

    public displayInfo : "QCInfo" | "RefSeqInfo" | "AlignmentInfo" | "SNPPositions";
    public inspectingUUID : string;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.displayInfo = "QCInfo";
        this.fastqInputs = new Array<Fastq>();
        this.fastaInputs = new Array<Fasta>();
        this.alignData = new Array<alignData>();
    }
    public onMount() : void
    {
        let self = this;
        (<HTMLInputElement>document.getElementById("rightPanel")).onclick = function(this : HTMLElement,ev : MouseEvent){
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
        rightPanel.addView(this.views,"rightSlideOutPanelView");
        reportView.addView(this.views,"reportView");
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].mount();
        }
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.rightPanelOpen = false;
            this.firstRender = false;
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
        
    }
}