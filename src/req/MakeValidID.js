"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replace(str, oldt, newt) {
    let res = str;
    res = res.replace(new RegExp(oldt, "g"), newt);
    return res;
}
exports.replace = replace;
function makeValidID(str) {
    let res = str;
    res = replace(res, " ", "_");
    res = replace(res, "[.]", "_");
    res = replace(res, "/", "a");
    res = replace(res, "\\\\", "a");
    res = replace(res, ":", "a");
    res = replace(res, "[(]", "_");
    res = replace(res, "[)]", "_");
    return res;
}
exports.makeValidID = makeValidID;
function findOriginalInput(str, inputs) {
    for (let i = 0; i != inputs.length; ++i) {
        if (makeValidID(inputs[i].name) === str)
            return inputs[i].name;
    }
    return "";
}
exports.findOriginalInput = findOriginalInput;
