"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawn = require("child_process");
const fs = require("fs");
const dataMgr = require("./dataMgr");
function logJobError(path, obj) {
    fs.appendFileSync(path, JSON.stringify(obj, undefined, 4));
}
exports.logJobError = logJobError;
function logVerbose(path, obj) {
    fs.appendFileSync(path, JSON.stringify(obj, undefined, 4));
}
exports.logVerbose = logVerbose;
class Job {
    constructor(processName, args, callBackChannel, unBuffer, callBackObj, extraData) {
        this.processName = processName;
        this.args = args;
        this.callBackChannel = callBackChannel;
        this.callBackObj = callBackObj;
        this.done = false;
        this.running = false;
        this.unBuffer = unBuffer;
        this.extraData = extraData;
        this.retCode = undefined;
        this.errorLog = dataMgr.getKey("application", "jobErrorLog");
        this.vLog = dataMgr.getKey("application", "jobVerboseLog");
    }
    unBufferBufferedData(data) {
        let unBufferedData = "";
        for (let i in data) {
            if (data[i] != 0 && data[i] != undefined) {
                let char = String.fromCharCode(data[i]);
                if (char && char != undefined)
                    unBufferedData += char;
            }
        }
        unBufferedData = unBufferedData.replace(new RegExp("\\u0000", "g"), "");
        return unBufferedData;
    }
    EmitStdo(data, err, out) {
        let obj;
        if (!this.unBuffer) {
            obj = {
                processName: this.processName,
                args: this.args,
                data: data,
                done: this.done,
                extraData: this.extraData
            };
            if (err && !out)
                obj.stderr = true;
            if (out && !err)
                obj.stdout = true;
        }
        if (this.unBuffer) {
            obj = {
                processName: this.processName,
                args: this.args,
                done: this.done,
                unBufferedData: this.unBufferBufferedData(data),
                extraData: this.extraData
            };
            if (err && !out)
                obj.stderr = true;
            if (out && !err)
                obj.stdout = true;
        }
        if (this.retCode != undefined && this.retCode != 0) {
            if (this.errorLog)
                logJobError(this.errorLog, obj);
        }
        if (this.vLog)
            logVerbose(this.vLog, obj);
        this.callBackObj.send(this.callBackChannel, obj);
    }
    OnOut(data) {
        this.EmitStdo(data, false, true);
    }
    OnErr(data) {
        this.EmitStdo(data, true, false);
    }
    OnSpawnError(err) {
        throw new Error("\nCould not spawn process: " + this.processName + " " + err + "\n CWD: " + process.cwd() + "\n");
    }
    OnComplete(retCode) {
        this.done = true;
        this.running = false;
        this.retCode = retCode;
        let obj;
        obj = {
            processName: this.processName,
            args: this.args,
            done: this.done,
            retCode: retCode,
            extraData: this.extraData
        };
        if (retCode != 0 && this.errorLog)
            logJobError(this.errorLog, obj);
        if (this.vLog)
            logVerbose(this.vLog, obj);
        this.callBackObj.send(this.callBackChannel, obj);
    }
    Run() {
        this.process = spawn.spawn(this.processName, this.args);
        this.running = true;
        var obj = this;
        this.process.stderr.on('data', function (data) {
            obj.OnErr(data);
        });
        this.process.stdout.on('data', function (data) {
            obj.OnOut(data);
        });
        this.process.on('exit', function (retCode) {
            obj.OnComplete(retCode);
        });
        this.process.on('error', function (err) {
            obj.OnSpawnError(err);
        });
    }
}
exports.Job = Job;
