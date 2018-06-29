/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib.ts" />

import {SAMRead,ReadFragment} from "@chgibb/unmappedcigarfragments/lib/lib";


/**
 * A SAM read with each of its mapped and unmapped fragments
 *
 * @export
 * @interface ReadWithFragments
 */
export interface ReadWithFragments
{
    read : SAMRead;
    fragments : Array<ReadFragment>;
}
