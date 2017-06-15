import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
import alignData from "./../alignData";
export class OpenPileupViewer extends atomic.AtomicOperation
{
    public align : alignData;
    public contig : string;
    public start : number;
    public stop : number;
    constructor()
    {
        super();
    }
    public setData(data : {
        align : alignData,
        contig : string,
        start : number,
        stop : number
    }) : void
    {
        this.align = data.align;
        this.contig = data.contig;
        this.start = data.start;
        this.stop = data.stop;
    }
    public run() : void
    {
        winMgr.windowCreators["pileup"].Create();
        this.setSuccess(this.flags);
        this.update();
    }
}