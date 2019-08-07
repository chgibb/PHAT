import * as fs from "fs";
import * as readline from "readline";

import {parseSAMRead, SAMRead} from "./samRead";

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
) : Promise<number> 
{
    return new Promise<number>(async (resolve) => 
    {
        let retrieved = 0;
        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(file)
            }
        );

        rl.on("line",function(line : string)
        {
            let read = parseSAMRead(line);
            if(read)
            {
                if(read.POS >= start && read.POS <= end)
                {
                    retrieved++;
                    cb(read,evaluateCIGAR(read.SEQ,read.CIGAR));
                }
            }
        });

        rl.on("close",function()
        {
            resolve(retrieved);
        });
    });
}
