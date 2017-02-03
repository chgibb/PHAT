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
        /**
         * @prop {string} name - Path to file
         * @prop {string} alias - File name without path
         * @prop {number} size - Size in bytes of file
         * @prop {string} sizeString - Formatted size of file
         * @prop {string} validID - Escapped ID for use as a valid HTML ID
         * @prop {boolean} checked - Whether this file is selected or not
         */
        this.name = name;
        this.alias = trimPath(name);
        this.size = 0;
        this.sizeString = "0";
        this.sequences = 0;
        this.validID = id.makeValidID(name);
        this.checked = false;
    }
}