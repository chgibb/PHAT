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

export interface CIGARSection
{
    op : "M" | "I" | "D" | "N" | "S" | "H" | "P" | "=" | "X" | "*"
    val : number;
}


//Taken from https://samtools.github.io/hts-specs/SAMv1.pdf
let CIGARRegex : RegExp = /\*|([0-9]+[MIDNSHPX=])+/;
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

export function evaluateCIGAR(seq : string,cigar : string) : Array<string> | undefined
{
    let res : Array<string> = new Array<string>();

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
                refPos += sections[i].val;
            }

            else if(sections[i].op == "I" || sections[i].op == "S" || sections[i].op == "=" || sections[i].op == "X")
            {
                res.push(seq.substring(refPos,refPos+sections[i].val));
                refPos += sections[i].val;
            }

            if(refPos > seq.length)
                throw new Error("Stepped off end of query sequence");
        }
    }

    if(res.length == 0)
        return undefined;
    else
        return res;
}

export function getReads(
    file : string,
    start : number,
    end : number,
    cb : (read : SAMRead,unMappedFragments : Array<string> | undefined) => void
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
        })
    });
}