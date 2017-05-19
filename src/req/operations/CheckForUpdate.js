"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const atomic = require("./atomicOperations");
class CheckForUpdate extends atomic.AtomicOperation {
    constructor() {
        super();
    }
    setData(data) {
        this.token = data.token;
    }
    run() {
        let self = this;
        this.checkForUpdateProcess = cp.fork("resources/app/CheckForUpdate.js");
        this.checkForUpdateProcess.on("message", function (ev) {
            if (ev.finishedSettingData == true) {
                self.checkForUpdateProcess.send({
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
            self.checkForUpdateProcess.send({
                setData: true,
                data: {
                    token: self.token
                }
            });
        }, 500);
    }
}
exports.CheckForUpdate = CheckForUpdate;
