# unMappedCIGARFragments

## Usage
```typescript
/// <reference path="./lib/lib" />
import {getReads,SAMRead,ReadFragment} from "./lib/lib";

let start = 0;
let end = 10000;
getReads(
    "someSample.sam",
    start,
    end,
    (read : SAMRead,fragments : Array<ReadFragment> | undefined) => {
        //Will be called once for each read who's aligned position begins between start and end inclusive, provided an unmapped fragment is identified.
        //fragments will hold all mapped and unmapped fragments in read (from left to right) identified by evaluating read's CIGAR string against it's query sequence
    }
).then((total : number) => {
    //total will be number of reads with at least one unmapped fragment from 0-10,000 and total number of times callback was called
}).catch(() => {
    //Failed. Likely I/O error
});

```