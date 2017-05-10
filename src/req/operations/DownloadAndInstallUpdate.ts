import * as fs from "fs";
import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent,AtomicOperationIPC} from "./../atomicOperationsIPC";
export class DownloadAndInstallUpdate extends atomic.AtomicOperation
{
    public asset : any;
    public token : string;
    public downloadAndInstallUpdateProcess : cp.ChildProcess;
    constructor()
    {
        super();
    }
    public setData(data : any) : void
    {
        this.asset = data.asset;
        this.token = data.token;
        //this.destinationArtifacts.push("phat.update");
        //this.generatedArtifacts.push("phat.update");
    }
    public run() : void
    {
        let self = this;
        this.downloadAndInstallUpdateProcess = cp.fork("resources/app/DownloadAndInstallUpdate.js");
        this.downloadAndInstallUpdateProcess.on(
            "message",function(ev : AtomicOperationForkEvent)
            {
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
            }
        );
        setTimeout(
            function(){
                self.downloadAndInstallUpdateProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : <AtomicOperationIPC>{
                            asset : self.asset,
                            token : self.token
                        }
                    }
                );
            },500
        );
    }
}