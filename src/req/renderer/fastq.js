/**
 * @module req/renderer/fastq
 */
var id = require('./MakeValidID.js');
var trimPath = require('./trimPath.js');
module.exports = class
{
    /**
     * @param {string} name - Path to fastq file
     */
    constructor(name)
    {
        this.name = name;
        this.alias = trimPath(name);
        this.size = 0;
        this.sizeString = "0";
        this.sequences = 0;
        this.validID = id.makeValidID(name);
        this.checked = false;
    }
}