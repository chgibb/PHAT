import * as electron from "electron";

import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";

export class UnDockWindow extends atomic.AtomicOperation
{
    public refName : string;
    public guestinstance : number;

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
        this.logRecord = atomic.openLog(this.name,"UnDock Window");

        winMgr.windowCreators[this.refName].Create();

        this.flags.success = true;
        this.flags.done = true;
        this.update();
    }
}
