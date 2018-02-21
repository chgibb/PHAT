import * as fs from "fs";
import * as readline from "readline";

import * as dFormat from "./dateFormat";
import {Contig} from "./fastaContigLoader";
import {getReadableAndWritable} from "./getAppPath";

export class BLASTSegmentResult
{
    public uuid : string;
    public alignUUID : string;
    public contigUUID : string
    public start : number;
    public stop : number;
    public totalReads : number;
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

export function getBLASTReadResultsDir(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}/readResults`);
}

export function streamSamSegmentReads(blastResult : BLASTSegmentResult,cb : (read : string) => void) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
            input : fs.createReadStream(getSamSegment(blastResult))
        }); 

        rl.on("line",function(line : string){
            cb(line);
        });

        rl.on("close",function(){
            return resolve();
        });
    });
}