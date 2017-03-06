import {makeValidID} from "./MakeValidID";
import {trimPath} from "./trimPath";
export default class Fasta
{
    public name : string;
    public alias : string;
    public checked : boolean;
    public size : number;
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public indexed : boolean;
    public indexing : boolean;
    public indexes : Array<any>;
    public host : boolean;
    public pathogen : boolean;
    public type : string;
    public constructor(name : string)
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
        this.validID = makeValidID(name);
        this.indexed = false;
        this.indexing = false;
        this.indexes = new Array();
        this.host = false;
        this.pathogen = false;
        this.type = "";
    }
}