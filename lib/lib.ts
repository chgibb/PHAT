import * as readline from "readline";
import * as fs from "fs";

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
}

/**
 * Parses a SAM read string into a SAMRead object
 * 
 * @export
 * @param {string} line 
 * @returns {(SAMRead | undefined)} 
 */
export function parseRead(line : string) : SAMRead | undefined
{
    //don't try to parse header lines
    if(line.trim()[0] == "@")
        return undefined;
    let res : SAMRead = new SAMRead();

    let cols = line.split(/\s/);

    res.QNAME = cols[0];
    res.FLAG = parseInt(cols[1]);
    res.RNAME = cols[2];
    res.POS = parseInt(cols[3]);
    res.MAPQ = parseInt(cols[4]);
    res.CIGAR = cols[5];
    res.RNEXT = cols[6];
    res.PNEXT = parseInt(cols[7]);
    res.TLEN = parseInt(cols[8]);
    res.SEQ = cols[9];
    res.QUAL = cols[10];

    return res;
}

/**
 * Represents a single section of a CIGAR string
 * 
 * @export
 * @interface CIGARSection
 */
export interface CIGARSection
{
    op : "M" | "I" | "D" | "N" | "S" | "H" | "P" | "=" | "X" | "*"
    val : number;
}


//Taken from https://samtools.github.io/hts-specs/SAMv1.pdf
let CIGARRegex : RegExp = /\*|([0-9]+[MIDNSHPX=])+/;

/**
 * Parse the sections of the given CIGAR string into an array
 * 
 * @export
 * @param {string} cigar 
 * @returns {(Array<CIGARSection> | undefined)} 
 */
export function parseCIGARSections(cigar : string) : Array<CIGARSection> | undefined
{
    if(!cigar || cigar == "*" || !CIGARRegex.test(cigar))
        return undefined;

    let res : Array<CIGARSection> = new Array<CIGARSection>();

    let str = "";
    for(let i = 0; i != cigar.length; ++i)
    {
        if(cigar[i] != "M" && cigar[i] != "I" && cigar[i] != "D" && cigar[i] != "N" && cigar[i] != "S" && cigar[i] != "H" && cigar[i] != "P" && cigar[i] != "=" && cigar[i] != "X")
        {
            str += cigar[i];
        }

        else
        {
            res.push(<CIGARSection>{
                op : cigar[i],
                val : parseInt(str)
            });
            str = "";
        }
    }

    return res;
}

export interface ReadFragment
{
    seq : string;
    type : "mapped" | "unmapped" | "remainder"; 
}

/**
 * Evaluates the given CIGAR string against the given query sequence. Returns
 * identified unmapped fragments
 * 
 * @export
 * @param {string} seq 
 * @param {string} cigar 
 * @returns {(Array<string> | undefined)} 
 */
export function evaluateCIGAR(seq : string,cigar : string) : Array<ReadFragment> | undefined
{
    let res : Array<ReadFragment> = new Array<ReadFragment>();

    let sections : Array<CIGARSection> | undefined = parseCIGARSections(cigar);

    if(!sections)
        return undefined;
    
    else
    {
        let str = "";
        let refPos = 0;
        //From the spec, https://samtools.github.io/hts-specs/SAMv1.pdf only M, I, S, = and X will step the query sequence so that's all we care about
        for(let i = 0; i != sections.length; ++i)
        {
            if(sections[i].op == "M")
            {
                res.push({
                    seq : seq.substring(refPos,refPos+sections[i].val),
                    type : "mapped"
                });
                refPos += sections[i].val;
            }

            else if(sections[i].op == "I" || sections[i].op == "S" || sections[i].op == "=" || sections[i].op == "X")
            {
                res.push({
                    seq : seq.substring(refPos,refPos+sections[i].val),
                    type : "unmapped"
                });
                refPos += sections[i].val;
            }

            if(refPos > seq.length)
                throw new Error("Stepped off end of query sequence");
        }

        if(refPos < seq.length)
        {
            res.push({
                seq : seq.substring(refPos,seq.length),
                type : "remainder"
            });
        }
    }

    if(res.length == 0)
        return undefined;
    else
        return res;
}

/**
 * For each SAM read from (reference position) start to end in file, calls cb with the read object
 * as well as any unmapped fragments identified by evaluating the read's CIGAR string
 * 
 * @export
 * @param {string} file 
 * @param {number} start 
 * @param {number} end 
 * @param {((read : SAMRead,unMappedFragments : Array<string> | undefined) => void)} cb 
 * @returns {Promise<number>} 
 */
export function getReads(
    file : string,
    start : number,
    end : number,
    cb : (read : SAMRead,fragments : Array<ReadFragment> | undefined) => void
) : Promise<number> {
    return new Promise<number>(async (resolve) => {
        let retrieved = 0;
        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(file)
            }
        );

        rl.on("line",function(line : string){
            let read = parseRead(line);
            if(read)
            {
                if(read.POS >= start && read.POS <= end)
                {
                    retrieved++;
                    cb(read,evaluateCIGAR(read.SEQ,read.CIGAR));
                }
            }
        });

        rl.on("close",function(){
            resolve(retrieved);
        });
    });
}
