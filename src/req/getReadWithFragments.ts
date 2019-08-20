import {ReadWithFragments} from "./readWithFragments";
import {getReads, ReadFragment} from "./cigar";
import {SAMRead} from "./samRead";

/**
 * Returns all reads which aligned starting between start and stop and which contain one or more 
 * mapped or unmapped fragment
 *
 * @export
 * @param {string} file - File path
 * @param {number} start - Start position
 * @param {number} stop - End position
 * @param {(parsedReads : number) => void} progress - Progress callback
 * @returns {Promise<Array<ReadWithFragments>>}
 */
export function getReadWithFragments(
    file : string,
    start : number,
    stop : number,
    progress : (parsedReads : number) => void
) : Promise<Array<ReadWithFragments>> 
{
    return new Promise<Array<ReadWithFragments>>(async (
        resolve : (value : Array<ReadWithFragments>) => void
    ) => 
    {
        let res : Array<ReadWithFragments> = new Array<ReadWithFragments>();
        let parsedReads = 0;
        await getReads(file,start,stop,function(read : SAMRead,fragments : Array<ReadFragment> | undefined)
        {
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