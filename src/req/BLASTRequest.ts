/*
    This module was adapted from https://ncbi.nlm.nih.gov/blast/docs/web_blast.pl
*/

/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib" />

import {SAMRead} from "./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib";

import {BLASTOutputRawJSON,cleanBLASTXML,validateRawBlastOutput} from "./BLASTOutput";

export type RID = string;

export type QueryStatus = "searching" | "failed" | "unknown" | "ready" | "nohits";

/**
 * Parses a BLAST request identifier (RID) out of src. src should be returnned from BLAST proper
 * 
 * @export
 * @param {string} src 
 * @returns {RID} 
 */
export function getRID(src : string) : RID
{   
    let line : RegExpExecArray | null = /^    RID = (.*$)/m.exec(src);
    let split = line![0].split(/\s/);
    return split[split.length - 1];
}

/**
 * Parses a BLAST request time of execution (RTOE) out of src. src should be returned from BLAST proper
 * 
 * @export
 * @param {string} src 
 * @returns {number} 
 */
export function getRTOE(src : string) : number
{
    let line : RegExpExecArray | null = /^    RTOE = (.*$)/m.exec(src);
    let split = line![0].split(/\s/);
    return parseInt(split[split.length - 1]);
}

/**
 * Sleeps the current process for the given number of seconds
 * 
 * @export
 * @param {number} seconds 
 */
export function sleep(seconds : number) : void
{
	let stop = new Date(new Date().getTime() + seconds * 1000);
	while(stop > new Date()){}
}

/**
 * Submit a query for nucleotide sequence seq to BLAST using MegaBLAST against nt database.
 * Returns the RID and RTOE for the request.
 * 
 * @export
 * @param {string} seq 
 * @returns {Promise<{rid : RID,rtoe : number}>} 
 */
export function makeQuery(seq : string) : Promise<{rid : RID,rtoe : number}>
{
    const request = require("request");

    return new Promise<{rid : RID,rtoe : number}>(async (resolve,reject) => {
        let url : string = `https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?`;
        request.post({
            url : url+`CMD=Put&PROGRAM=blastn&MEGABLAST=on&DATABASE=nt&QUERY=${seq}`,
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        },function(error : any,response : any,body : any){
            resolve({
                rid : getRID(response.body),
                rtoe : getRTOE(response.body)
            });
        });
    });
}

/**
 * Retrieve status for the given RID
 * 
 * @export
 * @param {RID} rid 
 * @returns {Promise<QueryStatus>} 
 */
export function getQueryStatus(rid : RID) : Promise<QueryStatus>
{
    const request = require("request");

    return new Promise<QueryStatus>(async (
        resolve : (value : QueryStatus) => void,
        reject : (error : string) => void
    ) => {
        let url : string = `https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_OBJECT=SearchInfo&RID=${rid}`;
        request.get({
            url : url
        },function(error : any,response : any,body : any){
            if(/\s+Status=WAITING/m.exec(response.body))
            {
                return resolve("searching");
            }
            else if(/\s+Status=FAILED/m.exec(response.body))
            {
                return resolve("failed");
            }
            else if(/\s+Status=UNKNOWN/m.exec(response.body))
            {
                return resolve("unknown");
            }
            else if(/\s+Status=READY/m.exec(response.body))
            {
                if(/\s+ThereAreHits=yes/m.exec(response.body))
                {
                    return resolve("ready");
                }
                else if(/\s+ThereAreHits=no/m.exec(response.body))
                {
                    return resolve("nohits");
                }
            }
            return reject("Unexpected status returned by BLAST");
        });
    });
}

/**
 * Will (eventually) retrieve the results for the given RID once BLAST has completed the query.
 * Will poll based on delay and give progress using progressCB
 * 
 * @export
 * @param {RID} rid 
 * @param {number} delay 
 * @param {(status : QueryStatus) => void} progressCB 
 * @returns {Promise<string>} 
 */
export function retrieveQuery(
    rid : RID,
    delay : number,
    progressCB : (status : QueryStatus) => void
) : Promise<string | undefined> {
    const request = require("request");

    return new Promise<string | undefined>(async (
        resolve : (value : string | undefined) => void,
        reject
    ) => {
        let status = await getQueryStatus(rid);
        while(status == "searching")
        {
            progressCB(status);
            sleep(delay);
            status = await getQueryStatus(rid);
        }
        if(status == "ready")
        {
            progressCB(status);
            let url : string = `https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_TYPE=XML&RID=${rid}`;
            request.get({
                url : url
            },function(error : any,response : any,body : any){
                resolve(body);
            });
        }
        else if(status == "nohits")
            return resolve(undefined);
        else
            return reject(status);
    });
}

/**
 * Will submit and retrieve a MegaBLAST query for the given SAM read. Returns raw BLAST XML 
 * transformed to JSON
 * 
 * @export
 * @param {string} read 
 * @param {(status : QueryStatus) => void} progressCB 
 * @returns {Promise<BLASTOutputRawJSON>} 
 */
export function performQuery(read : string,progressCB : (status : QueryStatus) => void) : Promise<BLASTOutputRawJSON>
{
    const xml = require("xml2js");
    return new Promise<BLASTOutputRawJSON>(async (resolve : (value : BLASTOutputRawJSON) => void,reject) => {
        let {rid,rtoe} = await makeQuery(read);

        setTimeout(async function(){
            let result = await retrieveQuery(rid,5,function(status : QueryStatus){
                progressCB(status);
                if(status == "failed")
                    return reject(status);
            });

            if(!result)
            {
                return resolve(<BLASTOutputRawJSON>{
                    noHits : true
                });
            }
            
            xml.parseString(cleanBLASTXML(result),function(err : Error,result : BLASTOutputRawJSON){
                console.log(err);
                if(err)
                    return reject(err);
                
                else
                {
                    console.log(result);
                    if(!validateRawBlastOutput(result))
                    {
                        return reject("Invalid output from BLAST");
                    }
                    else
                    {
                        resolve(result);
                    }
                }
            });
        },rtoe);
    });
}
