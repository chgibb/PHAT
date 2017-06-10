"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const atomic = require("./atomicOperations");
const getAppPath_1 = require("./../getAppPath");
class OpenProject extends atomic.AtomicOperation {
    constructor() {
        super();
    }
    setData(data) {
        this.proj = data;
    }
    run() {
        let self = this;
        this.openProjectProcess = cp.fork(getAppPath_1.getReadable("OpenProject.js"));
        self.openProjectProcess.on("message", function (ev) {
            if (ev.finishedSettingData == true) {
                self.openProjectProcess.send({
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
            self.openProjectProcess.send({
                setData: true,
                data: self.proj,
                readableBasePath: getAppPath_1.getReadable(""),
                writableBasePath: getAppPath_1.getWritable(""),
                readableAndWritableBasePath: getAppPath_1.getReadableAndWritable("")
            });
        }, 10);
    }
}
exports.OpenProject = OpenProject;
