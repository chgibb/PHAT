"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const path = require("path");
function fsAccess(filePath, addProtocol = true) {
    if (addProtocol) {
        return url.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(process.cwd(), filePath)
        });
    }
    else
        return path.join(process.cwd(), filePath);
}
exports.default = fsAccess;
