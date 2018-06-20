/// <reference path="./../../../../node_modules/@chgibb/unmappedcigarfragments/lib/lib.ts" />

import {getReads,SAMRead,ReadFragment} from "./../../../../node_modules/@chgibb/unmappedcigarfragments/lib/lib";

export function getReadsWithLargeUnMappedFragments(file : string,start : number,stop : number,progress : (parsedReads : number) => void) : Promise<Array<SAMRead>>
{
    return new Promise<Array<SAMRead>>(async (resolve,reject) => {
        let res : Array<SAMRead> = new Array<SAMRead>();
        let parsedReads = 0;
        await getReads(file,start,stop,function(read : SAMRead,fragments : Array<ReadFragment>){
            parsedReads++;
            progress(parsedReads);
            if(!fragments || fragments.length == 0)
                return;
            for(let i = 0; i != fragments.length; ++i)
            {
                if(fragments[i].type == "unmapped" && fragments[i].seq.length >= 15)
                {
                    res.push(read);
                    break;
                }
            }
        });
        return resolve(res);
    });
}