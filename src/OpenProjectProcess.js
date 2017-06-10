"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atomicOperationsIPC_1 = require("./req/atomicOperationsIPC");
const openProject_1 = require("./req//openProject");
let proj;
let flags = new atomicOperationsIPC_1.CompletionFlags();
function progressCallBack(toUnpack, unPacked) {
    process.send({
        update: true,
        flags: flags,
        data: { toUnpack: toUnpack, unPacked: unPacked }
    });
}
process.on("message", function (ev) {
    if (ev.setData == true) {
        proj = ev.data;
        process.send({ finishedSettingData: true });
        return;
    }
    if (ev.run == true) {
        openProject_1.openProject(proj, progressCallBack).then(() => {
            flags.done = true;
            flags.failure = false;
            flags.success = true;
            process.send({
                update: true,
                flags: flags,
            });
            process.exit(0);
        }).catch((err) => {
            flags.done = true;
            flags.failure = true;
            flags.success = false;
            process.send({
                update: true,
                flags: flags,
                data: err
            });
            process.exit(1);
        });
    }
});
process.on("uncaughtException", function (err) {
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send({
        update: true,
        flags: flags,
        data: err
    });
    process.exit(1);
});
