/**
 * Taken from https://samtools.github.io/hts-specs/SAMv1.pdf
 * 
 * @export
 * @class SAMRead
 */
export class SAMRead
{
    public QNAME : string;
    public FLAG : number;
    public RNAME : string;
    public POS : number;
    public MAPQ : number;
    public CIGAR : string;
    public RNEXT : string;
    public PNEXT : number;
    public TLEN : number;
    public SEQ : string;
    public QUAL : string;

    public constructor( opt : {
        QNAME : string,
        FLAG : number,
        RNAME : string,
        POS : number,
        MAPQ : number,
        CIGAR : string,
        RNEXT : string,
        PNEXT : number,
        TLEN : number,
        SEQ : string,
        QUAL : string
    }) {
        this.QNAME = opt.QNAME;
        this.FLAG = opt.FLAG;
        this.RNAME = opt.RNAME;
        this.POS = opt.POS;
        this.MAPQ = opt.MAPQ;
        this.CIGAR = opt.CIGAR;
        this.RNEXT = opt.RNEXT;
        this.PNEXT = opt.PNEXT;
        this.TLEN = opt.TLEN;
        this.SEQ = opt.SEQ;
        this.QUAL = opt.QUAL;
    }
}

/**
 * Parses a SAM read string into a SAMRead object
 * 
 * @export
 * @param {string} line 
 * @returns {(SAMRead | undefined)} 
 */
export function parseSAMRead(line : string) : SAMRead | undefined
{
    //don't try to parse header lines
    if(line.trim()[0] == "@")
        return undefined;

    let cols = line.split(/\s/);

    return new SAMRead({
        QNAME : cols[0],
    FLAG :parseInt(cols[1]),
    RNAME: cols[2],
    POS :parseInt(cols[3]),
    MAPQ :parseInt(cols[4]),
    CIGAR: cols[5],
    RNEXT: cols[6],
    PNEXT: parseInt(cols[7]),
    TLEN :parseInt(cols[8]),
    SEQ :cols[9],
    QUAL :cols[10],
    });
}
