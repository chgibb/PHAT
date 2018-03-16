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

export function getReads(
    file : string,
    start : number,
    end : number,
    cb : (read : SAMRead,unMappedFragments : Array<string>) => void
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
                    cb(read,[]);
                }
            }
        });

        rl.on("close",function(){
            resolve(retrieved);
        })
    });
}