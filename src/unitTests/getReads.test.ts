/// <reference types="jest" />

import { SAMRead } from "../req/samRead";
import { getReads, ReadFragment } from '../req/cigar';

it(`should extract all reads at nt7`,async () => {
    let total = await getReads("testData/L6R1HPV16.sam",7,7,function(read : SAMRead,fragments : Array<ReadFragment> | undefined){
        expect(read.QNAME).toBe(`HWI-M04391:6:000000000-D0U4R:1:1102:18007:22066`);
        if(read.SEQ == `ATAATTCATGTATAAAACTAAGGGCGTAACCGAAATCGGTTGAACCGAAACCGGTTAGTATAAAAGCAGACATTTTATGCACCAAAAGAGAACTGCAATGTTTCAGGACCCACAGGAGCGACCCAGAAAGTTACCACATTTATGCACAGAG`)
        {
            expect(read.FLAG).toBe(89);
        }
        else if(read.SEQ == `TGTGCAAACCGTTTTGGGTTACACATTTACAAGCAACTTATATAATAATACTAAACTACAATAATTCATGTATAAAACTAAGGGCGTAACCGAAATCGGTTGAACCGAAACCGGTTAGTATAAAAGCAGACATTTTATGCACCAAAAGAGA`)
        {
            expect(read.FLAG).toBe(133);
        }
    });

    expect(total).toBe(2);
});

it(`should extract all reads at nt5`,async () => {
    let total = await getReads("testData/L6R1HPV16.sam",5,5,function(read : SAMRead,fragments : Array<ReadFragment> | undefined){

    });

    expect(total).toBe(3);
});

it(`should extract all reads from nt5 to nt7`,async () => {
    let total = await getReads("testData/L6R1HPV16.sam",5,7,function(read : SAMRead,fragments : Array<ReadFragment> | undefined){

    });

    expect(total).toBe(5);
});

it(`should extract all reads from nt1 to nt7800`,async () => {
    let total = await getReads("testData/L6R1HPV16.sam",0,7800,function(read : SAMRead,fragments : Array<ReadFragment>| undefined){

    });

    expect(total).toBe(5378);
});

it(`should extract all unmapped reads`,async () => {
    let total = await getReads("testData/L6R1HPV16.sam",0,0,function(read : SAMRead,fragments : Array<ReadFragment> | undefined){

    });

    expect(total).toBe(4666);
});