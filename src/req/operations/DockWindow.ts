import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
import {DockIpc} from "./../renderer/dock";
export class DockWindow extends atomic.AtomicOperation
{
    public toDock : string;
    public dockTarget : string;

    public constructor()
    {
        super();
        this.ignoreScheduler = true;
    }
    public setData(data : {
        toDock : string,
        dockTarget : string
    }) : void {
        this.toDock = data.toDock;
        this.dockTarget = data.dockTarget;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Dock Window");

        let target = winMgr.getWindowsByName(this.dockTarget)[0];
        target.webContents.send(
            "dockWindow",
            <DockIpc>{refName : this.toDock}
        );
        this.flags.success = true;
        this.flags.done = true;
        this.update();
    }
}