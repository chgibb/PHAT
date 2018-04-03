/// <reference path="./../../../../node_modules/@chgibb/unmappedcigarfragments/lib/lib.ts" />

import {getReads, SAMRead} from "./../../../../node_modules/@chgibb/unmappedcigarfragments/lib/lib";

export function getReadsWithLargeUnMappedFragments(file : string,start : number,stop : number) : Promise<Array<string>>
{
    return new Promise<Array<string>>(async (resolve,reject) => {
        let res : Array<string> = new Array<string>();
        await getReads(file,start,stop,function(read : SAMRead,unMappedFragments : Array<string>){
            if(!unMappedFragments || unMappedFragments.length == 0)
                return;
            for(let i = 0; i != unMappedFragments.length; ++i)
            {
                if(unMappedFragments[i].length >= 15)
                {
                    res.push(read.SEQ);
                    break;
                }
            }
        });
        return resolve(res);
    });
}