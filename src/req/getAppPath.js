"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
let app = null;
const getEdition_1 = require("./getEdition");
let readableBasePath = undefined;
let writableBasePath = undefined;
let readableAndWritableBasePath = undefined;
let isPortable = /(portable)/i;
function isRenderer() {
    return (process && process.type == "renderer");
}
exports.isRenderer = isRenderer;
function getElectronApp() {
    let electron = undefined;
    try {
        electron = require("electron");
        if (app)
            return true;
        if (isRenderer()) {
            app = electron.remote.app;
            return true;
        }
        else {
            app = electron.app;
            return true;
        }
    }
    catch (err) {
        return false;
    }
}
function setReadableBasePath(path) {
    readableBasePath = path;
}
exports.setReadableBasePath = setReadableBasePath;
function setWritableBasePath(path) {
    writableBasePath = path;
}
exports.setWritableBasePath = setWritableBasePath;
function setReadableAndWritableBasePath(path) {
    readableAndWritableBasePath = path;
}
exports.setReadableAndWritableBasePath = setReadableAndWritableBasePath;
function getLinuxConfigDir() {
    if (process.env.HOME) {
        return process.env.HOME + "/.config/phat";
    }
    return undefined;
}
function getReadableDir() {
    if (getElectronApp())
        return path.dirname(process.execPath) + "/resources/app";
    else
        return process.cwd() + "/resources/app";
}
function getWin32ConfigDir() {
    return undefined;
}
function getConfigDir() {
    if (process.platform == "linux")
        return getLinuxConfigDir();
    return undefined;
}
function getReadable(relativePath) {
    if (!readableBasePath) {
        if (!getElectronApp()) {
            let readable = getReadableDir();
            if (readable) {
                setReadableBasePath(readable);
                return readableBasePath + "/" + relativePath;
            }
            else
                throw new Error("No readable base path set");
        }
        else
            setReadableBasePath(app.getAppPath());
    }
    return readableBasePath + "/" + relativePath;
}
exports.getReadable = getReadable;
function getWritable(relativePath) {
    if (isPortable.test(getEdition_1.getEdition()))
        return getReadable(relativePath);
    if (!writableBasePath) {
        if (!getElectronApp()) {
            let configDir = getConfigDir();
            if (configDir) {
                setWritableBasePath(configDir);
                return writableBasePath + "/" + relativePath;
            }
            else
                throw new Error("No readable base path set");
        }
        else
            setWritableBasePath(app.getPath("userData"));
    }
    return writableBasePath + "/" + relativePath;
}
exports.getWritable = getWritable;
function getReadableAndWritable(relativePath) {
    if (isPortable.test(getEdition_1.getEdition()))
        return getReadable(relativePath);
    if (!readableAndWritableBasePath) {
        if (!getElectronApp()) {
            let configDir = getConfigDir();
            if (configDir) {
                setReadableAndWritableBasePath(configDir);
                return readableAndWritableBasePath + "/" + relativePath;
            }
            else
                throw new Error("No readable/writable base path set");
        }
        else
            setReadableAndWritableBasePath(app.getPath("userData"));
    }
    return readableAndWritableBasePath + "/" + relativePath;
}
exports.getReadableAndWritable = getReadableAndWritable;
