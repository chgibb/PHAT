"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastq_1 = require("./../fastq");
const fasta_1 = require("./../fasta");
const canRead_1 = require("./canRead");
const model_1 = require("./model");
class Input extends model_1.DataModelMgr {
    constructor(channel, ipc) {
        super(channel, ipc);
        this.fastqInputs = new Array();
        this.fastaInputs = new Array();
    }
    postFastqInputs() {
        this.ipcHandle.send("saveKey", {
            action: "saveKey",
            channel: this.channel,
            key: "fastqInputs",
            val: this.fastqInputs
        });
    }
    postFastaInputs() {
        this.ipcHandle.send("saveKey", {
            action: "saveKey",
            channel: this.channel,
            key: "fastaInputs",
            val: this.fastaInputs
        });
    }
    addFastq(path) {
        if (!canRead_1.default(path))
            return false;
        for (let i = 0; i != this.fastqInputs.length; ++i) {
            if (this.fastqInputs[i].path == path || this.fastqInputs[i].absPath == path) {
                return false;
            }
        }
        this.fastqInputs.push(new fastq_1.default(path));
        return true;
    }
    addFasta(path) {
        if (!canRead_1.default(path))
            return false;
        let hasComma = new RegExp("(,)", "g");
        if (hasComma.test(path))
            throw new Error("Comma in path");
        for (let i = 0; i != this.fastaInputs.length; ++i) {
            if (this.fastaInputs[i].path == path || this.fastaInputs[i].absPath == path) {
                return false;
            }
        }
        this.fastaInputs.push(new fasta_1.Fasta(path));
        return true;
    }
    indexFasta(fasta) {
        this.ipcHandle.send("runOperation", {
            opName: "indexFasta",
            channel: this.channel,
            key: "fastaInputs",
            uuid: fasta.uuid
        });
        return false;
    }
    fastqExists(uuid) {
        for (let i = 0; i != this.fastqInputs.length; ++i) {
            if (this.fastqInputs[i].uuid == uuid)
                return true;
        }
        return false;
    }
    fastaExists(uuid) {
        for (let i = 0; i != this.fastaInputs.length; ++i) {
            if (this.fastaInputs[i].uuid == uuid)
                return true;
        }
        return false;
    }
}
exports.default = Input;
