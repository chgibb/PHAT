"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function trimPath(str) {
    let rev = "";
    let res = "";
    for (let i = str.length - 1; i >= 0; --i) {
        if (str[i] != "\\" && str[i] != "/")
            rev += str[i];
        if (str[i] == "\\" || str[i] == "/")
            break;
    }
    for (let i = rev.length - 1; i >= 0; --i) {
        res += rev[i];
    }
    return res;
}
exports.default = trimPath;
