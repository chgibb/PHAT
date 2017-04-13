import {File} from "./../file";
import {makeValidID} from "./MakeValidID";
import trimPath from "./trimPath";
export class Fasta extends File
{
    public alias : string;
    public checked : boolean;
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public indexed : boolean;
    public indexing : boolean;
    public indexes : Array<any>;
    public host : boolean;
    public pathogen : boolean;
    public type : string;
    public twoBit : string;
    public contigs : Array<string>;
    public fai : string;
    public constructor(path : string)
    {
        /**
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
        super(path);
        this.alias = trimPath(path);
        this.checked = false;
        this.sequences = 0;
        this.validID = makeValidID(path);
        this.indexed = false;
        this.indexing = false;
        this.indexes = new Array();
        this.host = false;
        this.pathogen = false;
        this.type = "";
        this.twoBit = "";
        this.contigs = new Array<string>();
        this.fai = "";
    }
}