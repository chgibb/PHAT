import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "./../atomicOperationsIPC";
import {getReadable} from "./../getAppPath";
import { Mangle } from '../mangle';
export class DownloadAndInstallUpdate extends atomic.AtomicOperation
{
    @Mangle public  asset : any;
    @Mangle public  downloadAndInstallUpdateProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    @Mangle public  setData(data : any) : void
    {
        this.asset = data.asset;
    }
    @Mangle public  run() : void
    {
        this.logRecord = atomic.openLog(this.name,"Download and Install Update");
        let self = this;
        this.downloadAndInstallUpdateProcess = atomic.makeFork("DownloadAndInstallUpdate.js",<AtomicOperationForkEvent>{
            setData : true,
            data : <AtomicOperationIPC>{
                asset : self.asset
            }
        },function(ev : AtomicOperationForkEvent){
            if(ev.finishedSettingData == true)
            {
                self.downloadAndInstallUpdateProcess.send(
                    <AtomicOperationForkEvent>{
                        run : true
                    }
                );
            }
            if(ev.update == true)
            {
                self.extraData = ev.data;
                self.flags = ev.flags;
                self.update();
            }    
        });
        this.addPID(this.downloadAndInstallUpdateProcess.pid);
    }
}