"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("./file");
const MakeValidID_1 = require("./MakeValidID");
const trimPath_1 = require("./trimPath");
const getAppPath_1 = require("./getAppPath");
class Fasta extends file_1.File {
    constructor(path) {
        super(path);
        this.alias = trimPath_1.default(path);
        this.checked = false;
        this.sequences = 0;
        this.validID = MakeValidID_1.makeValidID(path);
        this.indexed = false;
        this.indexing = false;
        this.indexes = new Array();
        this.host = false;
        this.pathogen = false;
        this.type = "";
        this.contigs = new Array();
    }
}
exports.Fasta = Fasta;
function getFaiPath(fasta) {
    return getAppPath_1.getReadableAndWritable(`rt/indexes/${fasta.uuid}.fai`);
}
exports.getFaiPath = getFaiPath;
function get2BitPath(fasta) {
    return getAppPath_1.getReadableAndWritable(`rt/indexes/${fasta.uuid}.2bit`);
}
exports.get2BitPath = get2BitPath;
