"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atomicOperationsIPC_1 = require("./req/atomicOperationsIPC");
const getUpdate = require("./req/getLatestUpdate");
let flags = new atomicOperationsIPC_1.CompletionFlags();
let token = "";
process.on("message", function (ev) {
    if (ev.setData == true) {
        token = ev.data.token;
        process.send({ finishedSettingData: true });
        return;
    }
    if (ev.run == true) {
        getUpdate.getLatestUpdate("chgibb", "PHAT", token).then((res) => {
            flags.done = true;
            flags.success = true;
            process.send({
                update: true,
                flags: flags,
                data: res
            });
            process.exit(0);
        }).catch((arg) => {
            console.log(arg);
            flags.done = true;
            flags.success = false;
            flags.failure = true;
            process.send({
                update: true,
                flags: flags,
                data: arg
            });
            process.exit(1);
        });
    }
});
process.on("uncaughtException", function (err) {
    console.log(err);
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
    console.log(err);
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
