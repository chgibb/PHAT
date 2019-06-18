/// <reference types="jest" />

import {parseBowtie2AlignmentReport,Bowtie2Report} from "./../req/bowTie2AlignmentReportParser";

let reportText = "2689 reads; of these:\n  2689 (100.00%) were paired; of these:\n    2689 (100.00%) aligned concordantly 0 times\n    0 (0.00%) aligned concordantly exactly 1 time\n    0 (0.00%) aligned concordantly >1 times\n    ----\n    2689 pairs aligned concordantly 0 times; of these:\n      0 (0.00%) aligned discordantly 1 time\n    ----\n    2689 pairs aligned 0 times concordantly or discordantly; of these:\n      5378 mates make up the pairs; of these:\n        5378 (100.00%) aligned 0 times\n        0 (0.00%) aligned exactly 1 time\n        0 (0.00%) aligned >1 times\n0.00% overall alignment rate\n";
let reportText2 = "2689 reads; of these:\n  2689 (100.00%) were paired; of these:\n    2384 (88.66%) aligned concordantly 0 times\n    305 (11.34%) aligned concordantly exactly 1 time\n    0 (0.00%) aligned concordantly >1 times\n    ----\n    2384 pairs aligned concordantly 0 times; of these:\n      27 (1.13%) aligned discordantly 1 time\n    ----\n    2357 pairs aligned 0 times concordantly or discordantly; of these:\n      4714 mates make up the pairs; of these:\n        4700 (99.70%) aligned 0 times\n        14 (0.30%) aligned exactly 1 time\n        0 (0.00%) aligned >1 times\n12.61% overall alignment rate\n";

it("should parse correctly",() => 
{
    expect(parseBowtie2AlignmentReport(reportText)).toEqual(<Bowtie2Report>{
        mates : 5378,
        overallAlignmentRate : 0,
        reads : 2689
    });

    expect(parseBowtie2AlignmentReport(reportText2)).toEqual(<Bowtie2Report>{
        mates : 4714,
        overallAlignmentRate :  12.61,
        reads : 2689
    });
});
