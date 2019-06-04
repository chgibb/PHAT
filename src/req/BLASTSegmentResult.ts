import * as fs from "fs";
import * as readline from "readline";

import {ReadWithFragments} from "./readWithFragments";
import {BLASTOutputRawJSON} from "./BLASTOutput";
import {getReadableAndWritable} from "./getAppPath";

/**
 * The results of all SAM reads BLASTed in a given run
 *
 * @export
 * @class BLASTReadResult
 */
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

/**
 * The results of all SAM read fragments BLASTed in a given run
 *
 * @export
 * @class BLASTFragmentResult
 */
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


/**
 * Control structure for retrieving results from a BLAST run
 *
 * @export
 * @class BLASTSegmentResult
 */
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

export function getBLASTReadResultsStore(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}/readResults.nldjson`);
}

export function getBLASTFragmentResultsStore(blastResult : BLASTSegmentResult) : string
{
    return getReadableAndWritable(`rt/BLASTSegmentResults/${blastResult.uuid}/fragmentResults.nldjson`);
}

/**
 * Retrieve all SAM reads BLASTed in a given run
 *
 * @export
 * @param {BLASTSegmentResult} blastResult
 * @returns {Promise<Array<BLASTReadResult>>}
 */
export function getBLASTReadResults(blastResult : BLASTSegmentResult) : Promise<Array<BLASTReadResult>> 
{
    return new Promise<Array<BLASTReadResult>>(async (resolve : (value : Array<BLASTReadResult>) => void,reject) => 
    {
        let res = new Array<BLASTReadResult>();

        if(blastResult.readsBLASTed == 0)
            return resolve(res);

        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(getBLASTReadResultsStore(blastResult))
            }
        );

        rl.on("line",function(line : string)
        {
            let result : BLASTReadResult = JSON.parse(line);

            if(result)
            {
                res.push(result);
                return;
            }
        });

        rl.on("close",function()
        {
            return resolve(res);
        });
    });
}

/**
 * Retrieve all SAM read fragments BLASTed in a given run
 *
 * @export
 * @param {BLASTSegmentResult} blastResult
 * @returns {Promise<Array<BLASTFragmentResult>>}
 */
export function getBLASTFragmentResults(blastResult : BLASTSegmentResult) : Promise<Array<BLASTFragmentResult>> 
{
    return new Promise<Array<BLASTFragmentResult>>(async (resolve : (value : Array<BLASTFragmentResult>) => void) => 
    {
        let res = new Array<BLASTFragmentResult>();

        if(blastResult.readsBLASTed == 0)
            return resolve(res);

        if(!fs.existsSync(getBLASTFragmentResultsStore(blastResult)))
            return resolve(res);

        let rl : readline.ReadLine = readline.createInterface(
            <readline.ReadLineOptions>{
                input : fs.createReadStream(getBLASTFragmentResultsStore(blastResult))
            }
        );

        rl.on("line",function(line : string)
        {
            let result : BLASTFragmentResult = JSON.parse(line);

            if(result)
            {
                res.push(result);
            }
        });

        rl.on("close",function()
        {
            return resolve(res);
        });
    });
}