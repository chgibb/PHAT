"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const fs = require("fs");
const getAppPath_1 = require("./../getAppPath");
const rimraf = require("rimraf");
class AtomicOperation {
    constructor() {
        this.generatedArtifacts = new Array();
        this.destinationArtifacts = new Array();
        this.generatedArtifactsDirectories = new Array();
        this.destinationArtifactsDirectories = new Array();
        this.flags = new CompletionFlags();
    }
    getGeneratedArtifacts() {
        return this.generatedArtifacts;
    }
    setGeneratedArtifacts(artifacts) {
        this.generatedArtifacts = artifacts;
    }
    getDestinationArtifacts() {
        return this.destinationArtifacts;
    }
    setDestinationArtifacts(artifacts) {
        this.destinationArtifacts = artifacts;
    }
    getGeneratedArtifactsDirectories() {
        return this.generatedArtifactsDirectories;
    }
    setGeneratedArtifactsDirectories(artifacts) {
        this.generatedArtifactsDirectories = artifacts;
    }
    getDestinationArtifactsDirectories() {
        return this.destinationArtifactsDirectories;
    }
    setDestinationArtifactsDirectories(artifacts) {
        this.destinationArtifactsDirectories = artifacts;
    }
    setFailure(flags) {
        flags.done = true;
        flags.success = false;
        flags.failure = true;
    }
    setSuccess(flags) {
        flags.done = true;
        flags.success = true;
        flags.failure = false;
    }
    abortOperationWithMessage(msg) {
        this.setFailure(this.flags);
        this.extraData = msg;
        this.update();
    }
}
exports.AtomicOperation = AtomicOperation;
class CompletionFlags {
    constructor() {
        this.done = false;
        this.success = false;
        this.failure = false;
    }
}
exports.CompletionFlags = CompletionFlags;
exports.registeredOperations = new Array();
exports.operationsQueue = new Array();
exports.updates = new events_1.EventEmitter();
function clearOperationsQueue() {
    exports.operationsQueue = new Array();
}
exports.clearOperationsQueue = clearOperationsQueue;
function register(opName, op) {
    for (let i = 0; i != exports.registeredOperations.length; ++i) {
        if (exports.registeredOperations[i].name == opName) {
            console.log("Could not register");
            return;
        }
    }
    exports.registeredOperations.push({
        name: opName,
        op: op
    });
}
exports.register = register;
function cleanGeneratedArtifacts(op) {
    for (let i = 0; i != op.generatedArtifacts.length; ++i) {
        try {
            fs.unlinkSync(op.generatedArtifacts[i]);
        }
        catch (err) { }
    }
    for (let i = 0; i != op.generatedArtifactsDirectories.length; ++i) {
        try {
            rimraf.sync(op.generatedArtifactsDirectories[i]);
        }
        catch (err) { }
    }
}
exports.cleanGeneratedArtifacts = cleanGeneratedArtifacts;
function cleanDestinationArtifacts(op) {
    for (let i = 0; i != op.destinationArtifacts.length; ++i) {
        try {
            fs.unlinkSync(op.destinationArtifacts[i]);
        }
        catch (err) { }
    }
    for (let i = 0; i != op.destinationArtifactsDirectories.length; ++i) {
        try {
            rimraf.sync(op.destinationArtifactsDirectories[i]);
        }
        catch (err) { }
    }
}
exports.cleanDestinationArtifacts = cleanDestinationArtifacts;
function addOperation(opName, data) {
    for (let i = 0; i != exports.registeredOperations.length; ++i) {
        if (exports.registeredOperations[i].name == opName) {
            let op = new (exports.registeredOperations[i].op)();
            op.name = exports.registeredOperations[i].name;
            op.setData(data);
            op.update = function () {
                if (op.flags.done) {
                    cleanGeneratedArtifacts(op);
                    if (op.flags.failure)
                        cleanDestinationArtifacts(op);
                    op.endEpoch = Date.now();
                    op.endDate = new Date(op.endEpoch);
                    fs.appendFile(getAppPath_1.getReadableAndWritable("operationTimerLog.txt"), `${op.name} end ${op.endDate}\n`, function (err) {
                        if (err)
                            throw err;
                    });
                }
                exports.updates.emit(op.name, op);
            };
            exports.operationsQueue.push(op);
            return;
        }
    }
    console.log("Could not add operation " + opName);
}
exports.addOperation = addOperation;
function runOperations(maxRunning) {
    let currentRunning = 0;
    for (let i = 0; i != exports.operationsQueue.length; ++i) {
        if (exports.operationsQueue[i].running)
            currentRunning++;
        if (currentRunning >= maxRunning)
            break;
        if (!exports.operationsQueue[i].running) {
            exports.operationsQueue[i].run();
            exports.operationsQueue[i].running = true;
            currentRunning++;
            exports.operationsQueue[i].startEpoch = Date.now();
            exports.operationsQueue[i].startDate = new Date(exports.operationsQueue[i].startEpoch);
            fs.appendFile(getAppPath_1.getReadableAndWritable("operationTimerLog.txt"), `${exports.operationsQueue[i].name} start ${exports.operationsQueue[i].startDate}\n`, function (err) {
                if (err)
                    throw err;
            });
        }
    }
    for (let i = exports.operationsQueue.length - 1; i >= 0; --i) {
        if (exports.operationsQueue[i].flags.done) {
            if (exports.operationsQueue[i].flags.success || exports.operationsQueue[i].flags.failure) {
                exports.operationsQueue.splice(i, 1);
            }
        }
    }
}
exports.runOperations = runOperations;
