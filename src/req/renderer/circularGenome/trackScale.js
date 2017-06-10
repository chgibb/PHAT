"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function add(options) {
    let res = `
        <trackscale ${(() => {
        if (options && options.interval)
            return `interval="${options.interval}"`;
        return "";
    })()} ${(() => {
        if (options && options.style)
            return `style="${options.style}"`;
        return "";
    })()} ${(() => {
        if (options && options.direction)
            return `direction="${options.direction}"`;
        return "";
    })()} ${(() => {
        if (options && options.tickSize)
            return `ticksize="${options.tickSize}"`;
        return "";
    })()} ${(() => {
        if (options && options.showLabels)
            return `showlabels="${options.showLabels}"`;
        return "";
    })()} ${(() => {
        if (options && options.vAdjust)
            return `vadjust="${options.vAdjust}"`;
        return "";
    })()} ${(() => {
        if (options && options.labelStyle)
            return `labelstyle="${options.labelStyle}"`;
        return "";
    })()}>
            
    `;
    return res;
}
exports.add = add;
function end() {
    return `</trackscale>`;
}
exports.end = end;
