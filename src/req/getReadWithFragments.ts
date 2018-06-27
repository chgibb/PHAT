/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib.ts" />

import {getReads,SAMRead,ReadFragment} from "@chgibb/unmappedcigarfragments/lib/lib";

import {ReadWithFragments} from "./readWithFragments";

export function getReadWithFragments(
    file : string,
    start : number,
    stop : number,
    progress : (parsedReads : number) => void
) : Promise<Array<ReadWithFragments>> {
    return new Promise<Array<ReadWithFragments>>(async (
        resolve : (value : Array<ReadWithFragments>) => void
    ) => {
        let res : Array<ReadWithFragments> = new Array<ReadWithFragments>();
        let parsedReads = 0;
        await getReads(file,start,stop,function(read : SAMRead,fragments : Array<ReadFragment>){
            parsedReads++;
            progress(parsedReads);
            if(!fragments || fragments.length == 0)
                return;
            res.push({
                    read : read,
                    fragments : fragments
            });
        });
        return resolve(res);
    });
}