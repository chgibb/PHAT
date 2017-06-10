"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function add(options) {
    let res = `
        <plasmid ${(() => {
        if (options && options.sequenceLength)
            return `sequencelength="${options.sequenceLength}"`;
        return "";
    })()} ${(() => {
        if (options && options.plasmidHeight)
            return `plasmidheight="${options.plasmidHeight}"`;
        return "";
    })()} ${(() => {
        if (options && options.plasmidWidth)
            return `plasmidwidth="${options.plasmidWidth}"`;
        return "";
    })()}>
            
    `;
    return res;
}
exports.add = add;
function end() {
    return `</plasmid>`;
}
exports.end = end;
