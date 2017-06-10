"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const atomic = require("./atomicOperations");
const getAppPath_1 = require("./../getAppPath");
class SaveCurrentProject extends atomic.AtomicOperation {
    constructor() {
        super();
    }
    setData(data) {
        this.proj = data;
    }
    run() {
        let self = this;
        this.saveCurrentProjectProcess = cp.fork(getAppPath_1.getReadable("SaveCurrentProject.js"));
        self.saveCurrentProjectProcess.on("message", function (ev) {
            if (ev.finishedSettingData == true) {
                self.saveCurrentProjectProcess.send({
                    run: true
                });
            }
            if (ev.update == true) {
                self.extraData = ev.data;
                self.flags = ev.flags;
                if (ev.flags.success == true) {
                    self.setSuccess(self.flags);
                }
                self.update();
            }
        });
        setTimeout(function () {
            self.saveCurrentProjectProcess.send({
                setData: true,
                data: self.proj,
                readableBasePath: getAppPath_1.getReadable(""),
                writableBasePath: getAppPath_1.getWritable(""),
                readableAndWritableBasePath: getAppPath_1.getReadableAndWritable("")
            });
        }, 500);
    }
}
exports.SaveCurrentProject = SaveCurrentProject;
