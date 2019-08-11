import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import { AtomicOperationForkEvent, AtomicOperationIPC } from "./../atomicOperationsIPC";
import { getReadable } from "./../getAppPath";

export interface DownloadAndInstallUpdateData {
    opName: "downloadAndInstallUpdate";
    data :{
        asset : any;
    };
}

export class DownloadAndInstallUpdate extends atomic.AtomicOperation<DownloadAndInstallUpdateData>
{
    public asset: any;
    public downloadAndInstallUpdateProcess: cp.ChildProcess | undefined;
    constructor(data: DownloadAndInstallUpdateData) {
        super(data);

        this.asset = data.data.asset;
    }

    public run(): void {
        this.logRecord = atomic.openLog(this.opName, "Download and Install Update");
        let self = this;
        this.downloadAndInstallUpdateProcess = atomic.makeFork("DownloadAndInstallUpdate.js", <AtomicOperationForkEvent>{
            setData: true,
            data: <AtomicOperationIPC>{
                asset: self.asset
            }
        }, function (ev: AtomicOperationForkEvent) {
                if (ev.finishedSettingData == true) {
                    self.downloadAndInstallUpdateProcess!.send(
                        <AtomicOperationForkEvent>{
                            run: true
                        }
                    );
                }
                if (ev.update == true) {
                    self.extraData = ev.data;
                    self.flags = ev.flags!;
                    self.update!();
                }
            });
        this.addPID(this.downloadAndInstallUpdateProcess.pid);
    }
}