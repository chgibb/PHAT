"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const atomic = require("./atomicOperations");
class DownloadAndInstallUpdate extends atomic.AtomicOperation {
    constructor() {
        super();
    }
    setData(data) {
        this.asset = data.asset;
        this.token = data.token;
    }
    run() {
        let self = this;
        this.downloadAndInstallUpdateProcess = cp.fork("resources/app/DownloadAndInstallUpdate.js");
        this.downloadAndInstallUpdateProcess.on("message", function (ev) {
            if (ev.finishedSettingData == true) {
                self.downloadAndInstallUpdateProcess.send({
                    run: true
                });
            }
            if (ev.update == true) {
                self.extraData = ev.data;
                self.flags = ev.flags;
                self.update();
            }
        });
        setTimeout(function () {
            self.downloadAndInstallUpdateProcess.send({
                setData: true,
                data: {
                    asset: self.asset,
                    token: self.token
                }
            });
        }, 500);
    }
}
exports.DownloadAndInstallUpdate = DownloadAndInstallUpdate;
