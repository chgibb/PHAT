import {File} from "./file";
import {Contig} from "./fastaContigLoader";
import {makeValidID} from "./MakeValidID";
import {getReadableAndWritable} from "./getAppPath";
export class Fasta extends File
{
    public checked : boolean;
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public indexed : boolean;
    public indexedForVisualization : boolean;
    public indexing : boolean;
    public indexingForVisualization : boolean;
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

export function getFaiPath(fasta : Fasta) : string
{
    return getReadableAndWritable(`rt/indexes/${fasta.uuid}.fai`);
}

export function get2BitPath(fasta : Fasta) : string
{
    return getReadableAndWritable(`rt/indexes/${fasta.uuid}.2bit`);
}