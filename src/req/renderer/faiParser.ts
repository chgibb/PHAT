/**
 * @module req/renderer/faiParser
 */
/**
 * Naive implementation of a contig parser. Loads entire file into memory at once. Not suitable for large files.
 * @param {string} file - Path to file to load
 * @returns {Array<string>} - Array of contig names
 */
import * as fs from "fs";
export default function getContigs(file : string) : Array<string>
{
    let res : Array<string> = new Array<string>();
    let tokens : Array<string> = fs.readFileSync(file).toString().split(new RegExp("[ ]|[\t]|[\n]"));
    for(let i : number = 0; i <= tokens.length; i += 5)
    {
        if(tokens[i])
            res.push(tokens[i]);
    }
    return res;
}