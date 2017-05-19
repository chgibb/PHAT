"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawn = require("child_process");
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
    OnErr(data) {
        if (!this.unBuffer) {
            this.callBackObj.send(this.callBackChannel, {
                processName: this.processName,
                args: this.args,
                data: data,
                done: this.done,
                extraData: this.extraData
            });
        }
        if (this.unBuffer) {
            this.callBackObj.send(this.callBackChannel, {
                processName: this.processName,
                args: this.args,
                done: this.done,
                unBufferedData: this.unBufferBufferedData(data),
                extraData: this.extraData
            });
        }
    }
    OnOut(data) {
        this.OnErr(data);
    }
    OnSpawnError(err) {
        throw new Error("\nCould not spawn process: " + this.processName + " " + err + "\n CWD: " + process.cwd() + "\n");
    }
    OnComplete(retCode) {
        this.done = true;
        this.running = false;
        this.callBackObj.send(this.callBackChannel, {
            processName: this.processName,
            args: this.args,
            done: this.done,
            retCode: retCode,
            extraData: this.extraData
        });
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
