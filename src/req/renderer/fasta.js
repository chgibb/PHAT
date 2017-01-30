/**
 * @module req/renderer/fasta
 */
var id = require('./MakeValidID.js');
var trimPath = require('./trimPath.js');
module.exports = class
{
    /**
     * @param {string} name - Path to fasta file 
     */
    constructor(name)
    {
        this.name = name;
        this.alias = trimPath(name);
        this.checked = false;
        this.size = 0;
        this.sizeString = "0";
        this.sequences = 0;
        this.validID = id.makeValidID(name);
        this.indexed = false;
        this.indexing = false;
        this.indexes = new Array();
        this.host = false;
        this.pathogen = false;
        this.type = "";
    }
}