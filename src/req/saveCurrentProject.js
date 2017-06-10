"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mkdirp = require("mkdirp");
const tarfs = require("tar-fs");
const tarStream = require("tar-stream");
const getAppPath_1 = require("./getAppPath");
function saveCurrentProject(proj) {
    return new Promise((resolve, reject) => {
        mkdirp.sync(getAppPath_1.getReadableAndWritable("projects"));
        const ostream = fs.createWriteStream(proj.tarBall);
        ostream.on("error", (error) => { reject(error); });
        ostream.on("close", () => {
            resolve();
        });
        let pack = tarfs.pack(getAppPath_1.getReadableAndWritable("rt")).pipe(ostream);
        pack.on("error", function (err) {
            reject(err);
        });
        pack.on("close", function () {
            resolve();
        });
    });
}
exports.saveCurrentProject = saveCurrentProject;
