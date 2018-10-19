import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
import * as dataMgr from "./../main/dataMgr";
import {DockIpc} from "./../renderer/dock";
import { Mangle } from '../mangle';
export class DockWindow extends atomic.AtomicOperation
{
    public toDock : string;
    public dockTarget : string;

    public  constructor()
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

        //if the dock target is smaller than the window we're docking, expand the target to fit
        let newWindowOptions = dataMgr.getKey(this.toDock,"windowOptions");
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
        this.update();
    }
}