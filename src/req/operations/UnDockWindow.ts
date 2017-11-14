import * as electron from "electron";
const webContents = electron.webContents;

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
    }) : void {
        this.refName = data.refName;
        this.guestinstance = data.guestinstance;
    }

    public async run()
    {
        this.logRecord = atomic.openLog(this.name,"UnDock Window");

        await winMgr.createWCHost(this.refName);
        
        let target = winMgr.getWindowsByName(this.refName)[0];
        console.log(target);
        target.webContents.send("changeGuestInstance",{
            guestinstance : this.guestinstance
        });

        this.flags.success = true;
        this.flags.done = true;
        this.update();
    }
}