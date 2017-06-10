"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function getContigs(file) {
    let res = new Array();
    let tokens = fs.readFileSync(file).toString().split(new RegExp("[ ]|[\t]|[\n]"));
    for (let i = 0; i <= tokens.length; i += 5) {
        if (tokens[i])
            res.push(tokens[i]);
    }
    return res;
}
exports.default = getContigs;
