"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("./file");
const QCData_1 = require("./QCData");
const MakeValidID_1 = require("./MakeValidID");
const trimPath_1 = require("./trimPath");
class Fastq extends file_1.File {
    constructor(path) {
        super(path);
        this.alias = trimPath_1.default(path);
        this.sequences = 0;
        this.validID = MakeValidID_1.makeValidID(path);
        this.checked = false;
        this.QCData = new QCData_1.QCData();
    }
}
exports.default = Fastq;
