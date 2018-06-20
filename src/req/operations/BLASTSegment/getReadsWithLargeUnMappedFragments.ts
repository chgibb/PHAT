/// <reference path="./../../../../node_modules/@chgibb/unmappedcigarfragments/lib/lib.ts" />

import {getReads,SAMRead,ReadFragment} from "@chgibb/unmappedcigarfragments/lib/lib";

import {ReadWithFragments} from "./../../readWithFragments";

export function getReadsWithLargeUnMappedFragments(
    file : string,
    start : number,
    stop : number,
    progress : (parsedReads : number) => void
) : Promise<Array<ReadWithFragments>>
{
    return new Promise<Array<ReadWithFragments>>(async (resolve,reject) => {
        let res : Array<ReadWithFragments> = new Array<ReadWithFragments>();
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
                    res.push({
                        read : read,
                        fragments : fragments
                    });
                    break;
                }
            }
        });
        return resolve(res);
    });
}