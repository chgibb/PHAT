"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function add(options) {
    let res = `
        <plasmidtrack ${(() => {
        if (options && options.trackStyle)
            return `trackstyle="${options.trackStyle}"`;
        return "";
    })()} ${(() => {
        if (options && options.width)
            return `width="${options.width}"`;
        return "";
    })()} ${(() => {
        if (options && options.radius)
            return `radius="${options.radius}"`;
        return "";
    })()}>
            
    `;
    return res;
}
exports.add = add;
function end() {
    return `</plasmidtrack>`;
}
exports.end = end;
