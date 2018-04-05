/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib" />

import {SAMRead} from "./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib";

import {BlastOutputRawJSON,cleanBLASTXML,validateRawBlastOutput} from "./BLASTOutput";

export type RID = string;

export type QueryStatus = "searching" | "failed" | "unknown" | "ready";

export function getRID(src : string) : RID
{   
    let line : RegExpExecArray | null = /^    RID = (.*$)/m.exec(src);
    let split = line![0].split(/\s/);
    return split[split.length - 1];
}

export function getRTOE(src : string) : number
{
    let line : RegExpExecArray | null = /^    RTOE = (.*$)/m.exec(src);
    let split = line![0].split(/\s/);
    return parseInt(split[split.length - 1]);
}

export function sleep(seconds : number) : void
{
	let stop = new Date(new Date().getTime() + seconds * 1000);
	while(stop > new Date()){}
}

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

export function getQueryStatus(rid : RID) : Promise<QueryStatus>
{
    const request = require("request");

    return new Promise<QueryStatus>(async (resolve,reject) => {
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
            }
            return reject();
        });
    });
}

export function retrieveQuery(rid : RID,delay : number,progressCB : (status : QueryStatus) => void) : Promise<string>
{
    const request = require("request");

    return new Promise<string>(async (resolve,reject) => {
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
        else
            return reject(status);
    });
}

export function performQuery(read : SAMRead,progressCB : (status : QueryStatus) => void) : Promise<BlastOutputRawJSON>
{
    const xml = require("xml2js");
    return new Promise<BlastOutputRawJSON>(async (resolve,reject) => {
        let {rid,rtoe} = await makeQuery(read.SEQ);

        setTimeout(async function(){
            let result = await retrieveQuery(rid,5,function(status : QueryStatus){
                progressCB(status);
                if(status == "failed")
                    return reject(status);
            });

            xml.parseString(cleanBLASTXML(result),function(err : Error,result : BlastOutputRawJSON){
                if(err)
                    return reject(err);
                
                else
                {
                    if(!validateRawBlastOutput(result))
                    {
                        return reject("Invalid output from BLAST");
                    }
                    else
                    {
                        result.read = read;
                        resolve(result);
                    }
                }
            });
        },rtoe);
    });
}
