"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const rimraf = require("rimraf");
const tarfs = require("tar-fs");
const tarStream = require("tar-stream");
const gunzip = require("gunzip-maybe");
const getAppPath_1 = require("./getAppPath");
const rebuildRTDirectory_1 = require("./main/rebuildRTDirectory");
const dataMgr = require("./main/dataMgr");
function openProject(proj, cb) {
    return new Promise((resolve, reject) => {
        dataMgr.clearData();
        rimraf.sync(getAppPath_1.getReadableAndWritable("rt"));
        try {
            fs.accessSync(proj.tarBall);
            let totalFiles = 0;
            let unPackedFiles = 0;
            let countFiles = tarStream.extract();
            countFiles.on("entry", (header, stream, next) => {
                if (header) {
                    totalFiles++;
                    cb(totalFiles, unPackedFiles);
                }
                stream.on("end", () => {
                    next();
                });
                stream.resume();
            });
            countFiles.on("finish", () => {
                let extract = tarfs.extract(getAppPath_1.getReadableAndWritable("rt"), {
                    ignore: (name) => {
                        unPackedFiles++;
                        cb(totalFiles, unPackedFiles);
                        return false;
                    }
                });
                extract.on("finish", () => {
                    resolve();
                });
                let unPackStream = fs.createReadStream(proj.tarBall).pipe(gunzip()).pipe(extract);
            });
            fs.createReadStream(proj.tarBall).pipe(gunzip()).pipe(countFiles);
        }
        catch (err) {
            rebuildRTDirectory_1.rebuildRTDirectory();
            resolve();
        }
    });
}
exports.openProject = openProject;
