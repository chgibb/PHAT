import * as electron from "electron";
const webContents = electron.webContents;

import * as atomic from "./atomicOperations";
import { Mangle } from '../mangle';
export class ChangeTitle extends atomic.AtomicOperation
{
    public  id : number;
    public newTitle : string;

    public  constructor()
    {
        super();
        this.ignoreScheduler = true;
    }

    public setData(data : {
        id : number,
        newTitle : string
    }) : void {
        this.id = data.id;
        this.newTitle = data.newTitle;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Change Title");

        let allWCs : Array<Electron.WebContents> = webContents.getAllWebContents();

        //blast a message to all webContents.
        //it is up to windows to determine if they own the webContents given by id and 
        //how to update it's visible title. i.e. tab title in a dock or a window title in a wcHost
        for(let i = 0; i != allWCs.length; ++i)
        {
            allWCs[i].send("changeTitle",{id : this.id,newTitle : this.newTitle});
        }

        this.flags.success = true;
        this.flags.done = true;
        this.update();
    }
}