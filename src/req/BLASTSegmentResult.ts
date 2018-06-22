/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib" />

import * as fs from "fs";
import * as readline from "readline";

import {ReadWithFragments} from "./readWithFragments";
import {BLASTOutputRawJSON} from "./BLASTOutput";
import {getReadableAndWritable} from "./getAppPath";

export class BLASTReadResult
{
    public readonly resultType : string = "read";
    public readonly uuid : string;
    public readonly readWithFragments : ReadWithFragments;
    public readonly results : BLASTOutputRawJSON;
    public constructor(results : BLASTOutputRawJSON,readWithFragments : ReadWithFragments)
    {
        const uuidv4 : () => string = require("uuid/v4");

        this.results = results;
        this.readWithFragments = readWithFragments;
        this.uuid = uuidv4();
    }
}

export class BLASTFragmentResult
{
    public readonly resultType : string = "fragment";
    public readonly uuid : string;
    public readonly readuuid : string;
    public readonly seq : string;
    public readonly results : BLASTOutputRawJSON;
    public constructor(results : BLASTOutputRawJSON,seq : string,readuuid : string)
    {
        const uuidv4 : () => string = require("uuid/v4");

        this.results = results;
        this.seq = seq;
        this.readuuid = readuuid;
        this.uuid = uuidv4();
    }
}

export class BLASTSegmentResult
{
    public uuid : string;
    public start : number;
    public stop : number;
    public readsBLASTed : number;
    public avgSeqLength : number;
    public readonly program = "blastn";
    public readonly MEGABLAST = true;
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

export function getBLASTReadResultsStore(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}/readResults.nldjson`);
}

export function getBLASTFragmentResultsStore(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}/fragmentResults.nldjson`);
}

export function getBLASTReadResults(
    blastResult : BLASTSegmentResult,
    start : number,
    end : number
) : Promise<Array<BLASTReadResult>> {
    return new Promise<Array<BLASTReadResult>>(async (resolve : (value : Array<BLASTReadResult>) => void,reject) => {
        let res = new Array<BLASTReadResult>();

        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(getBLASTReadResultsStore(blastResult))
            }
        );

        rl.on("line",function(line : string){
            let result : BLASTReadResult = JSON.parse(line);

            if(result)
            {
                if(start == 0 && end == 0)
                {
                    res.push(result);
                    return;
                }
                else if(result.readWithFragments.read.POS >= start && result.readWithFragments.read.POS <= end)
                {
                    res.push(result);
                    return;
                }
            }
        });

        rl.on("close",function(){
            return resolve(res);
        })
    });
}

export function getBLASTFragmentResults(blastResult : BLASTSegmentResult) : Promise<Array<BLASTFragmentResult>> 
{
    return new Promise<Array<BLASTFragmentResult>>(async (resolve : (value : Array<BLASTFragmentResult>) => void) => {
        let res = new Array<BLASTFragmentResult>();

        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(getBLASTFragmentResultsStore(blastResult))
            }
        );

        rl.on("line",function(line : string){
            let result : BLASTFragmentResult = JSON.parse(line);

            if(result)
            {
                res.push(result);
            }
        });

        rl.on("close",function(){
            return resolve(res);
        })
    });
}