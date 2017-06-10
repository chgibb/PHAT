"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vm = require("vm");
const fs = require("fs");
if (!global.require)
    global.require = require;
function loadFromCache(jsFile, cdata) {
    let cache;
    let jsFileCode;
    try {
        cache = fs.readFileSync(cdata);
    }
    catch (err) {
        console.log("Could not load " + cdata);
        return 1;
    }
    try {
        jsFileCode = fs.readFileSync(jsFile);
    }
    catch (err) {
        console.log("Could not load " + jsFile + " fatal");
        return 2;
    }
    let compiledCode = new vm.Script(jsFileCode, {
        filename: jsFile,
        lineOffset: 0,
        displayErrors: true,
        cachedData: cache
    });
    if (!compiledCode.cachedDataRejected) {
        console.log("Successfully loaded from " + cdata);
        compiledCode.runInThisContext();
        return 0;
    }
    else {
        console.log("Cached code " + cdata + " was rejected.");
        return 3;
    }
}
function compileCache(jsFile, cdata) {
    let jsFileCode;
    let cache;
    let compiler;
    try {
        jsFileCode = fs.readFileSync(jsFile);
    }
    catch (err) {
        console.log("Could not load " + jsFile + " fatal");
        return 2;
    }
    compiler = new vm.Script(jsFileCode, {
        filename: jsFile,
        lineOffset: 0,
        displayErrors: true,
        produceCachedData: true
    });
    if (compiler.cachedDataProduced && compiler.cachedData) {
        cache = compiler.cachedData;
        console.log("Successfully compiled " + jsFile);
        try {
            fs.writeFileSync(cdata, cache);
        }
        catch (err) {
            console.log("Failed to write " + cdata);
            return 3;
        }
        return 0;
    }
    else {
        console.log("Failed to compile " + jsFile);
        return 1;
    }
}
function bootStrapCodeCache(jsFile, jsModule, cdata) {
    let cacheStatus = loadFromCache(jsFile, cdata);
    if (cacheStatus == 0)
        return;
    if (cacheStatus == 1 || cacheStatus == 3) {
        let compilerStatus = compileCache(jsFile, cdata);
        let secondTry = loadFromCache(jsFile, cdata);
        if (secondTry != 0 || compilerStatus != 0) {
            console.log("Falling back to require");
            require(jsModule);
            return;
        }
    }
    if (cacheStatus == 2) {
        throw new Error("Fatal error: Could not load file " + jsFile);
    }
}
exports.bootStrapCodeCache = bootStrapCodeCache;
