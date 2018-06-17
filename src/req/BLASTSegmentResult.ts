/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib" />

import * as fs from "fs";
import * as readline from "readline";

import {SAMRead} from "./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib";

import * as dFormat from "./dateFormat";
import {Contig} from "./fastaContigLoader";
import {BlastOutputRawJSON} from "./BLASTOutput";
import {getReadableAndWritable} from "./getAppPath";

export class BLASTSegmentResult
{
    public uuid : string;
    public start : number;
    public stop : number;
    public avgSeqLength : number;
    public readonly program = "blastn";
    public readonly MEGABLAST = true;
    public readonly dataBase = "nt";
    public dateStampString : string;
    public dateStamp : string;

    public constructor()
    {
        const uuidv4 : () => string = require("uuid/v4");
        this.uuid = uuidv4();
    }
}

export function getArtifactDir(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}`);
}

export function getSamSegment(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}/segment.sam`);
}

export function getBLASTResultsStore(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}/readResults.nldjson`);
}

export function getBLASTResults(
    blastResult : BLASTSegmentResult,
    start : number,
    end : number
) : Promise<Array<BlastOutputRawJSON>> {
    return new Promise<Array<BlastOutputRawJSON>>(async (resolve,reject) => {
        let res = new Array<BlastOutputRawJSON>();

        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(getBLASTResultsStore(blastResult))
            }
        );

        rl.on("line",function(line : string){
            let result : BlastOutputRawJSON = JSON.parse(line);

            if(result)
            {
                if(start == 0 && end == 0)
                {
                    res.push(result);
                    return;
                }
                else if(result.read.POS >= start && result.read.POS <= end)
                {
                    res.push(result);
                    return;
                }
            }
        });

        rl.on("close",function(){
            resolve(res);
        })
    });
}