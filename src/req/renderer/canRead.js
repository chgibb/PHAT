"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function canRead(file) {
    try {
        fs.accessSync(file, fs.constants.F_OK | fs.constants.R_OK);
    }
    catch (err) {
        return false;
    }
    return true;
}
exports.default = canRead;
