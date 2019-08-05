import { SAMRead } from './samRead';
import { ReadFragment } from './cigar';

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
