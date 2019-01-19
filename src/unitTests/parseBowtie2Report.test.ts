/// <reference types="jest" />

import {parseBowtie2AlignmentReport,Bowtie2Report} from "./../req/bowTie2AlignmentReportParser";

let reportText = `2689 reads; of these:\n  2689 (100.00%) were paired; of these:\n    2689 (100.00%) aligned concordantly 0 times\n    0 (0.00%) aligned concordantly exactly 1 time\n    0 (0.00%) aligned concordantly >1 times\n    ----\n    2689 pairs aligned concordantly 0 times; of these:\n      0 (0.00%) aligned discordantly 1 time\n    ----\n    2689 pairs aligned 0 times concordantly or discordantly; of these:\n      5378 mates make up the pairs; of these:\n        5378 (100.00%) aligned 0 times\n        0 (0.00%) aligned exactly 1 time\n        0 (0.00%) aligned >1 times\n0.00% overall alignment rate\n`;

it(`should parse correctly`,() => {
    expect(parseBowtie2AlignmentReport(reportText)).toEqual(<Bowtie2Report>{
        mates : 5378,
        overallAlignmentRate : 0,
        reads : 2689
    });
});
