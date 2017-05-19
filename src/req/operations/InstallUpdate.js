"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const atomic = require("./atomicOperations");
class InstallUpdate extends atomic.AtomicOperation {
    constructor() {
        super();
        this.filesInUpdate = 0;
    }
    setData(data) {
        this.generatedArtifacts.push("phat-linux-x64.tar.gz");
    }
    run() {
        let self = this;
        try {
            this.installUpdateJob = cp.fork("resources/app/installUpdate.js");
            this.installUpdateJob.on("message", function (data) {
                if (data.totalFiles) {
                    self.filesInUpdate = data.totalFiles;
                    self.update();
                    self.setSuccess(self.flags);
                }
            });
        }
        catch (err) {
            this.abortOperationWithMessage(err);
            return;
        }
    }
}
exports.InstallUpdate = InstallUpdate;
