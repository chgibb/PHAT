/// <reference types="jest" />

import {parseRead} from "./../lib/lib";

it(`should not parse header 1`,() => {
    expect(parseRead(`@HD	VN:1.0	SO:unsorted`)).toBeUndefined();
});

it(`should not parse header 2`,() => {
    expect(parseRead(`@SQ	SN:HPV16	LN:79061`)).toBeUndefined();
});

it(`should not parse header 3`,() => {
    expect(parseRead(`@PG	ID:bowtie2	PN:bowtie2	VN:2.2.9	CL:"/usr/lib/phat/resources/app/bowtie2-align-s --wrapper basic-0 -x /home/gibb/.config/phat/rt/indexes/7484e833-a343-4cdc-b5f1-1838070b7346 -S /home/gibb/.config/phat/rt/AlignmentArtifacts/37acf20b-826a-4e71-a094-1cdf653eb717/out.sam -1 /home/gibb/fastq/L6R1.R1.fastq -2 /home/gibb/fastq/L6R1.R2.fastq"`)).toBeUndefined();
});