import * as electron from "electron";
const ipc = electron.ipcMain;
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

        let self = this;

        //on response from a wcHost attaching to the given web contents
        ipc.once(`guestInstance-${this.guestinstance}-Attached`,function(event : Electron.IpcMessageEvent,arg : any){
            console.log(self.guestinstance+" attached to new host");
            //let the event loop spin before completing
            //the webview the given web contents was attached to before being moved will listen for completion and remove it
            //when this operation finishes. We let the event loop spin to make sure Electron has finished processing ipc messages and housekeeping triggered
            //by the move.
            setTimeout(function(){
                setImmediate(function(){
                    setImmediate(function(){
                        process.nextTick(function(){
                            setTimeout(function(){
                                self.flags.success = true;
                                self.flags.done = true;
                                self.update();
                            },50);
                        });
                    });
                });
            },10);
        });

        //create a new webContents host
        await winMgr.createWCHost(this.refName);
        
        //get a reference to the new host
        let windowGroup = winMgr.getWindowsByName(this.refName);
        let target = windowGroup[windowGroup.length-1];

        //signal the new host to attach to the given webcontents
        target.webContents.send("changeGuestInstance",{
            guestinstance : this.guestinstance
        });
        
    }
}