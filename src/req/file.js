"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Path = require("path");
const uuidv4 = require("uuid/v4");
const formatByteString_1 = require("./renderer/formatByteString");
class File {
    constructor(path) {
        this.path = path;
        this.absPath = Path.resolve(path);
        this.uuid = uuidv4();
        this.reachable = true;
        let stats = fs.statSync(path);
        this.size = stats.size;
        this.sizeString = formatByteString_1.default(this.size);
    }
}
exports.File = File;
