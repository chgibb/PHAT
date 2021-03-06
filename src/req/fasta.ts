import {File} from "./file";
import {Contig} from "./fastaContigLoader";
import {makeValidID} from "./MakeValidID";
import {getReadableAndWritable} from "./getAppPath";
export class Fasta extends File
{
    public checked : boolean;
    public sizeString : string | undefined;
    public sequences : number;
    public validID : string;

    /**
     * Indexed for Bowtie2
     *
     * @type {boolean}
     * @memberof Fasta
     */
    public indexed : boolean;
    public indexedForHisat2 : boolean | undefined;
    public indexedForVisualization : boolean | undefined;
    public indexing : boolean;
    public indexingForVisualization : boolean | undefined;
    public indexes : Array<any>;
    public contigs : Array<Contig>;
    public constructor(path : string)
    {
        super(path);
        this.checked = false;
        this.sequences = 0;
        this.validID = makeValidID(path);
        this.indexed = false;
        this.indexing = false;
        this.indexes = new Array();
        this.contigs = new Array<Contig>();
    }
}

/**
 * Returns path to fai for given reference sequence
 *
 * @export
 * @param {Fasta} fasta - Reference sequence
 * @returns {string}
 */
export function getFaiPath(fasta : Fasta) : string
{
    return getReadableAndWritable(`rt/indexes/${fasta.uuid}.fai`);
}

/**
 * Returns path to 2bit for given reference sequence
 *
 * @export
 * @param {Fasta} fasta - Reference sequence
 * @returns {string}
 */
export function get2BitPath(fasta : Fasta) : string
{
    return getReadableAndWritable(`rt/indexes/${fasta.uuid}.2bit`);
}

export function totalBP(fasta : Fasta) : number
{
    let res = 0;

    for(let i = 0; i != fasta.contigs.length; ++i)
    {
        res += fasta.contigs[i].bp;
    }

    return res;
}
