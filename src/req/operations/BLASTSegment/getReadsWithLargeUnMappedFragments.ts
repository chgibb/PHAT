/// <reference path="./../../../../node_modules/@chgibb/unmappedcigarfragments/lib/lib.ts" />

import {getReads,SAMRead} from "./../../../../node_modules/@chgibb/unmappedcigarfragments/lib/lib";

export function getReadsWithLargeUnMappedFragments(file : string,start : number,stop : number) : Promise<Array<SAMRead>>
{
    return new Promise<Array<SAMRead>>(async (resolve,reject) => {
        let res : Array<SAMRead> = new Array<SAMRead>();
        await getReads(file,start,stop,function(read : SAMRead,unMappedFragments : Array<string>){
            if(!unMappedFragments || unMappedFragments.length == 0)
                return;
            for(let i = 0; i != unMappedFragments.length; ++i)
            {
                if(unMappedFragments[i].length >= 15)
                {
                    res.push(read);
                    break;
                }
            }
        });
        return resolve(res);
    });
}