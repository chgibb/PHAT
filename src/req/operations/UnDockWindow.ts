import * as electron from "electron";

import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";

export interface UnDockWindowData
{
    opName : "unDockWindow";
    refName : string,
    guestinstance? : number
}

export class UnDockWindow extends atomic.AtomicOperation<UnDockWindowData>
{
    public refName : string;
    public guestinstance : number | undefined;

    public constructor(data : UnDockWindowData)
    {
        super(data);
        this.ignoreScheduler = true;

        this.refName = data.refName;
        this.guestinstance = data.guestinstance;
    }
    
    public async run()
    {
        this.logRecord = atomic.openLog(this.opName,"UnDock Window");

        winMgr.windowCreators[this.refName!].Create();

        this.flags.success = true;
        this.flags.done = true;
        this.update!();
    }
}
