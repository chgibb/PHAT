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

    return res;
}

export function getUnMappedReads(
    file : string,
    start : number,
    stop : number,
    cb : (read : SAMRead,unMappedReads : Array<string>) => void
) : Promise<number> {
    return new Promise<number>(async (resolve) => {
        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(file)
            }
        );
    });
}