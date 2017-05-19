"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatByteString(bytes) {
    let kb = 1000;
    let ndx = Math.floor(Math.log(bytes) / Math.log(kb));
    let fileSizeTypes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];
    let res = "";
    if (bytes >= 1000000)
        res += +(bytes / kb / kb).toFixed(2) + fileSizeTypes[ndx];
    else
        res += +(bytes / kb).toFixed(2) + fileSizeTypes[ndx];
    return res;
}
exports.default = formatByteString;
