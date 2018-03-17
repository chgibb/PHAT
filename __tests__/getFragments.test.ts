/// <reference types="jest" />

import {getReads,SAMRead} from "./../lib/lib";

it(`should extract fragments 1`,async () => {
    let total = await getReads("__tests__/data/L6R1HPV16.sam",0,7800,function(read : SAMRead,unMappedFragments : Array<string> | undefined){
        if(read.SEQ == "TTGATCCTGCAGAAGAAATAGAATTACAAACTATAACACCTTCTACATATACTACCACTTCACATGCAGCCTCACCTACTTCTATTAATAATGGCTTATATGATATTTATGCAGATGACTTTATTACAGATACTTCTACAACCCCGGTACC")
        {
            expect(unMappedFragments).toBeUndefined();
        }

        else if(read.SEQ == "GATGAATATGTTGCACGCACAAACATATATTATCATGCAGGAACATCCAGACTACTTGCAGTTGGACATCCCTATTTTCCTATTAAAAAACCTAACAATAACAAAATATTAGTTCCTAAAGTATCAGGATTACAATACAGGGTATTTAGAA")
        {
            expect(unMappedFragments).toBeUndefined();
        }

        else if(read.SEQ == "CTACACGACGCTCTTCCGATCTCTTGTGTAACTATTGTGTGATGCAACATAAATAAACTTATTGTTTCAACACCTACTAATTGTGTTGTGGTTATTCATTGTATATAAACTATATTTGCTACAATCTGTTTTTGTTTTATATATACTATAT")
        {
            expect(unMappedFragments).toBeDefined();
            expect(unMappedFragments!.length).toBe(1);
            expect(unMappedFragments![0]).toBe("ACGCTCTTCCGATCT");
        }

        else if(read.SEQ == "ACGACGCTCTTCCGATCTAATAAACCTTATTGGTTACAACGAGCACAGGGCCACAATAATGGCATTTGTTGGGGTAACCAACTATTTGTTACTGTTGTTGATACTACACGCAGTACAAATATGTCATTATGTGCTGCCATATCTACTTCAG")
        {
            expect(unMappedFragments).toBeDefined();
            expect(unMappedFragments!.length).toBe(2);
            expect(unMappedFragments![0]).toBe("CG");
            expect(unMappedFragments![1]).toBe("CGATCT");
        }
    });

    expect(total).toBe(5378);
});