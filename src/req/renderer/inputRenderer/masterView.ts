import * as viewMgr from "./../viewMgr";
import * as fastqView from "./FastqView";
import * as fastaView from "./FastaView";
import {fastqBrowseDialog} from "./fastqBrowseDialog"
import {fastaBrowseDialog} from "./fastaBrowseDialog";
import Fastq from "./../../fastq";
import {Fasta} from "./../../fasta";
export class View extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender : boolean;
    public fastqInputs : Array<Fastq>;
    public fastaInputs : Array<Fasta>;
    public constructor(div : string)
    {
        super("masterView",div);
        this.views = new Array<viewMgr.View>();
        this.firstRender = true;
        this.fastqInputs = new Array<Fastq>();
        this.fastaInputs = new Array<Fasta>();
    }
    public onMount() : void
    {
        fastqView.addView(this.views,"fastqView");
        fastaView.addView(this.views,"fastaView");
        for(let i = 0 ; i != this.views.length; ++i)
        {
            this.views[i].mount();
        }
    }
    public onUnMount() : void{}
    public renderView() : string
    {
        if(this.firstRender)
        {
            this.firstRender = false;
            return `
                <div id="fastqView" style="height:45%;width:100%;overflow-y:hidden;">
                </div>
                <div id="fastaView" style="height:45%;width:100%;">
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
        console.log("masterView");
        console.log(event.target);
        if(event.target.id == "browseFastqFiles")
        {
            fastqBrowseDialog();
        }
        if(event.target.id == "browseFastaFiles")
        {
            fastaBrowseDialog();
        }
    }
    public dataChanged() : void
    {
        let fastqView = <fastqView.View>viewMgr.getViewByName("fastqView",this.views);
        fastqView.fastqInputs = this.fastqInputs;

        let fastaView = <fastaView.View>viewMgr.getViewByName("fastaView",this.views);
        fastaView.fastaInputs = this.fastaInputs;

    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
