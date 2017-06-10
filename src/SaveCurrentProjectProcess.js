"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAppPath_1 = require("./req/getAppPath");
const atomicOperationsIPC_1 = require("./req/atomicOperationsIPC");
const saveCurrentProject_1 = require("./req//saveCurrentProject");
let proj;
let flags = new atomicOperationsIPC_1.CompletionFlags();
process.on("message", function (ev) {
    if (ev.setData == true) {
        proj = ev.data;
        getAppPath_1.setReadableBasePath(ev.readableBasePath);
        getAppPath_1.setWritableBasePath(ev.writableBasePath);
        getAppPath_1.setReadableAndWritableBasePath(ev.readableAndWritableBasePath);
        process.send({ finishedSettingData: true });
        return;
    }
    if (ev.run == true) {
        saveCurrentProject_1.saveCurrentProject(proj).then(() => {
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
process.on("unhandledRejection", function (err) {
    console.log("ERROR " + err);
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
