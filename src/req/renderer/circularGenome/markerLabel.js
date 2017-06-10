"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function add(options) {
    let res = `
        <markerlabel ${(() => {
        if (options && options.type)
            return `type="${options.type}"`;
        return "";
    })()} ${(() => {
        if (options && options.class)
            return `class="${options.class}"`;
        return "";
    })()} ${(() => {
        if (options && options.text)
            return `text="${options.text}"`;
        return "";
    })()} ${(() => {
        if (options && options.vAdjust)
            return `vadjust="${options.vAdjust}"`;
        return "";
    })()} 
                        ${(() => {
        if (options && options.labelStyle)
            return `labelstyle="${options.labelStyle}"`;
        return "";
    })()} ${(() => {
        if (options && options.wAdjust)
            return `wadjust="${options.wAdjust}"`;
        return "";
    })()}>
            
    `;
    return res;
}
exports.add = add;
function end() {
    return `</markerlabel>`;
}
exports.end = end;
