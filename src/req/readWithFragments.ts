/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib.ts" />

import {SAMRead,ReadFragment} from "@chgibb/unmappedcigarfragments/lib/lib";

export interface ReadWithFragments
{
    read : SAMRead;
    fragments : Array<ReadFragment>;
}
