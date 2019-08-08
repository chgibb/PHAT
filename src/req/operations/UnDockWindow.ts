import * as electron from "electron";

import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";

export class UnDockWindow extends atomic.AtomicOperation<{
    refName : string,
    guestinstance : number
}>
{
    public readonly operationName = "unDockWindow";
    public refName : string | undefined;
    public guestinstance : number | undefined;

    public constructor()
    {
        super();
        this.ignoreScheduler = true;
    }

    public setData(data : {
        refName : string,
        guestinstance : number
    }) : void 
    {
        this.refName = data.refName;
        this.guestinstance = data.guestinstance;
    }

    public async run()
    {
        this.logRecord = atomic.openLog(this.operationName,"UnDock Window");

        winMgr.windowCreators[this.refName!].Create();

        this.flags.success = true;
        this.flags.done = true;
        this.update!();
    }
}
