"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const cp = require("child_process");
let GitHubReleases = require("github-releases");
const tarfs = require("tar-fs");
const tarStream = require("tar-stream");
const gunzip = require("gunzip-maybe");
const atomicOperationsIPC_1 = require("./req/atomicOperationsIPC");
const getAppPath_1 = require("./req/getAppPath");
let flags = new atomicOperationsIPC_1.CompletionFlags();
let asset;
let token;
process.on("message", function (ev) {
    if (ev.setData == true) {
        asset = ev.data.asset;
        token = ev.data.token;
        process.send({ finishedSettingData: true });
        return;
    }
    if (ev.run == true) {
        let ghr = new GitHubReleases({ user: "chgibb", repo: "PHAT", token: token });
        ghr.downloadAsset(asset, (error, istream) => {
            if (error)
                throw new Error(error);
            let progress = 0;
            istream.on("data", (chunk) => {
                progress += chunk.length;
                process.send({
                    update: true,
                    data: { downloadProgress: progress },
                    flags: flags
                });
            });
            const ostream = fs.createWriteStream("phat.update");
            istream.pipe(ostream);
            istream.on("error", (error) => { throw new Error(error); });
            ostream.on("error", (error) => { throw new Error(error); });
            ostream.on("close", () => {
                flags.done = true;
                flags.success = true;
                flags.failure = false;
                process.send({
                    update: true,
                    flags: flags,
                });
                if (process.platform == "linux")
                    cp.spawnSync(getAppPath_1.getReadable("installUpdateProcess"));
                if (process.platform == "win32") {
                    let installer = cp.spawn(getAppPath_1.getReadable("installUpdateProcess.exe"), [], {
                        detached: true,
                        stdio: "ignore"
                    });
                    installer.unref();
                }
                process.exit(0);
            });
        });
    }
});
process.on("uncaughtException", function (err) {
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
