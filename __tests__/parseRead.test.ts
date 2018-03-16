/// <reference types="jest" />

import {parseRead,getUnMappedReads, SAMRead} from "./../lib/lib";

it(`should not parse header 1`,() => {
    expect(parseRead(`@HD	VN:1.0	SO:unsorted`)).toBeUndefined();
});

it(`should not parse header 2`,() => {
    expect(parseRead(`@SQ	SN:HPV16	LN:79061`)).toBeUndefined();
});

it(`should not parse header 3`,() => {
    expect(parseRead(`@PG	ID:bowtie2	PN:bowtie2	VN:2.2.9	CL:"/usr/lib/phat/resources/app/bowtie2-align-s --wrapper basic-0 -x /home/gibb/.config/phat/rt/indexes/7484e833-a343-4cdc-b5f1-1838070b7346 -S /home/gibb/.config/phat/rt/AlignmentArtifacts/37acf20b-826a-4e71-a094-1cdf653eb717/out.sam -1 /home/gibb/fastq/L6R1.R1.fastq -2 /home/gibb/fastq/L6R1.R2.fastq"`)).toBeUndefined();
});

it(`should parse read 1`,() => {
    let res = parseRead(`HWI-M04391:6:000000000-D0U4R:1:1101:13555:1780	77	*	0	0	*	*	0	0	CTGGCCCAGCATAACCTGACACCAGCCCCCTGCCCTTCTAGCTAAAAGCCGGTTGCTAAGTTTAGCCTGCCTGGTGATCATCTTTGCTTAAAAATCACCCACATTTCTCCAGTCCCTGACCCTGCCTTTCTGGGATTGCCTTTCCTGCTGG	>>AABFCCCFFFGGGGGGGGGGGGHDFEGGGFHGGHHHHCDFFBBBBDFB00AE0BG553DFG555AB11BB31B25D55D@FGF4@FG433431@33??111344@B4?33D33BD32???B2/0BFGDF4320BB22BFGF3?F32B22	YT:Z:UP`);

    expect(res).toBeDefined();

    expect(res!.QNAME).toBe(`HWI-M04391:6:000000000-D0U4R:1:1101:13555:1780`);
    expect(res!.FLAG).toBe(77);
    expect(res!.RNAME).toBe("*");
    expect(res!.POS).toBe(0);
    expect(res!.MAPQ).toBe(0);
    expect(res!.CIGAR).toBe("*");
    expect(res!.RNEXT).toBe("*");
    expect(res!.PNEXT).toBe(0);
    expect(res!.TLEN).toBe(0);
    expect(res!.SEQ).toBe(`CTGGCCCAGCATAACCTGACACCAGCCCCCTGCCCTTCTAGCTAAAAGCCGGTTGCTAAGTTTAGCCTGCCTGGTGATCATCTTTGCTTAAAAATCACCCACATTTCTCCAGTCCCTGACCCTGCCTTTCTGGGATTGCCTTTCCTGCTGG`);
    expect(res!.QUAL).toBe(`>>AABFCCCFFFGGGGGGGGGGGGHDFEGGGFHGGHHHHCDFFBBBBDFB00AE0BG553DFG555AB11BB31B25D55D@FGF4@FG433431@33??111344@B4?33D33BD32???B2/0BFGDF4320BB22BFGF3?F32B22`);

});

it(`should extract all reads at nt7`,async () => {
    let total = await getUnMappedReads("__tests__/data/L6R1HPV16.sam",7,7,function(read : SAMRead,unMappedFragments : Array<string>){

    });

    expect(total).toBe(2);
});

it(`should extract all reads at nt5`,async () => {
    let total = await getUnMappedReads("__tests__/data/L6R1HPV16.sam",5,5,function(read : SAMRead,unMappedFragments : Array<string>){

    });

    expect(total).toBe(3);
});

it(`should extract all reads from nt5 to nt7`,async () => {
    let total = await getUnMappedReads("__tests__/data/L6R1HPV16.sam",5,7,function(read : SAMRead,unMappedFragments : Array<string>){

    });

    expect(total).toBe(5);
});