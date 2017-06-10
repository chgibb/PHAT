"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const getAppPath_1 = require("./../getAppPath");
function rebuildRTDirectory() {
    fs.mkdirSync(getAppPath_1.getReadableAndWritable("rt"));
    fs.mkdirSync(getAppPath_1.getReadableAndWritable("rt/QCReports"));
    fs.mkdirSync(getAppPath_1.getReadableAndWritable("rt/indexes"));
    fs.mkdirSync(getAppPath_1.getReadableAndWritable("rt/AlignmentArtifacts"));
    fs.mkdirSync(getAppPath_1.getReadableAndWritable("rt/circularFigures"));
}
exports.rebuildRTDirectory = rebuildRTDirectory;
