import {makeValidID} from "./MakeValidID";
import {trimPath} from "./trimPath";
module.exports = class
{
    /**
     * @param {string} name - Path to fasta file 
     */
    constructor(name)
    {
        /**
         * @prop {string} name - Path to file
         * @prop {string} alias - File name without path
         * @prop {boolean} checked - Whether this file is selected or not
         * @prop {number} size - Size in bytes of file
         * @prop {string} sizeString - Formatted size of file
         * @prop {number} sequences - Number of sequences in file
         * @prop {string} validID - Escapped ID for use as a valid HTML ID
         * @prop {boolean} indexed - Whether this file has been indexed
         * @prop {boolean} indexing - Whether this file is being currently indexed
         * @prop {Array<string>} indexes - Bowtie2 indexes generated for this file
         * @prop {boolean} host - Whether this file is a host reference
         * @prop {boolean} pathogen - Whether this file is a pathogen reference
         */
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