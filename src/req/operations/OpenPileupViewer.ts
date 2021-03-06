import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
import {AlignData} from "./../alignData";

export interface OpenPileupViewerData
{
    opName : "openPileupViewer";
    align : AlignData;
    contig : string;
    start : number;
    stop : number;
}
export class OpenPileupViewer extends atomic.AtomicOperation<OpenPileupViewerData>
{
    public align : AlignData ;
    public contig : string ;
    public start : number ;
    public stop : number ;
    constructor(data : OpenPileupViewerData)
    {
        super(data);
        this.ignoreScheduler = true;

        this.align = data.align;
        this.contig = data.contig;
        this.start = data.start;
        this.stop = data.stop;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog("openPileupViewer","Open Pileup Viewer");
        winMgr.windowCreators["pileup"].Create();

        let viewers = winMgr.getWindowsByName("pileup");
        let viewer = viewers[viewers.length-1];

        let pileupOptions = {
            align : this.align,
            contig : this.contig,
            start : this.start,
            stop : this.stop
        };
        setTimeout(
            function()
            {
                viewer.webContents.send("pileup",pileupOptions);
            },500
        );

        this.setSuccess(this.flags);
        this.update!();
    }
}