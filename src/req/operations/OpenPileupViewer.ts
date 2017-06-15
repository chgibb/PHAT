import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
export class OpenPileupViewer extends atomic.AtomicOperation
{
    constructor()
    {
        super();
    }
    public setData() : void
    {

    }
    public run() : void
    {
        winMgr.windowCreators["pileup"].Create();
        this.setSuccess(this.flags);
        this.update();
    }
}