import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
import * as dataMgr from "./../main/dataMgr";
import {DockIpc} from "./../renderer/dock";

export interface DockWindowData
{
    opName : "dockWindow";
    toDock : string,
    dockTarget : string
}

export class DockWindow extends atomic.AtomicOperation<DockWindowData>
{
    public toDock : string;
    public dockTarget : string;

    public constructor(data : DockWindowData)
    {
        super(data);
        this.ignoreScheduler = true;

        this.toDock = data.toDock;
        this.dockTarget = data.dockTarget;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog(this.opName,"Dock Window");

        let target = winMgr.getWindowsByName(this.dockTarget!)[0];
        target.webContents.send(
            "dockWindow",
            <DockIpc>{refName : this.toDock}
        );

        //if the dock target is smaller than the window we're docking, expand the target to fit
        let newWindowOptions = dataMgr.getKey(this.toDock!,"windowOptions");
        if(newWindowOptions)
        {
            let bounds = target.getBounds();
            if(bounds.height < newWindowOptions.height)
                bounds.height = newWindowOptions.height;
            if(bounds.width < newWindowOptions.width)
                bounds.width = newWindowOptions.width;
            
            target.setBounds(bounds,true);
        }
        this.flags.success = true;
        this.flags.done = true;
        this.update!();
    }
}