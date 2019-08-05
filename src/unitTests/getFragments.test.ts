/// <reference types="jest" />

import {getReads,SAMRead,ReadFragment} from "./../lib/lib";

it(`should extract fragments 1`,async () => {
    let total = await getReads("__tests__/data/L6R1HPV16.sam",0,7800,function(read : SAMRead,fragments : Array<ReadFragment> | undefined){
        if(read.SEQ == "TTGATCCTGCAGAAGAAATAGAATTACAAACTATAACACCTTCTACATATACTACCACTTCACATGCAGCCTCACCTACTTCTATTAATAATGGCTTATATGATATTTATGCAGATGACTTTATTACAGATACTTCTACAACCCCGGTACC")
        {
            expect(fragments).toBeDefined();
            expect(fragments!.length).toBe(1);
            expect(fragments![0].seq).toBe("TTGATCCTGCAGAAGAAATAGAATTACAAACTATAACACCTTCTACATATACTACCACTTCACATGCAGCCTCACCTACTTCTATTAATAATGGCTTATATGATATTTATGCAGATGACTTTATTACAGATACTTCTACAACCCCGGTACC");
            expect(fragments![0].type).toBe("mapped");

            let joined = "";
            for(let i = 0; i != fragments!.length; ++i)
                joined += fragments![i].seq;
    
            expect(joined).toEqual(read.SEQ);
        }

        else if(read.SEQ == "GATGAATATGTTGCACGCACAAACATATATTATCATGCAGGAACATCCAGACTACTTGCAGTTGGACATCCCTATTTTCCTATTAAAAAACCTAACAATAACAAAATATTAGTTCCTAAAGTATCAGGATTACAATACAGGGTATTTAGAA")
        {
            expect(fragments).toBeDefined();
            expect(fragments!.length).toBe(1);
            expect(fragments![0].seq).toBe("GATGAATATGTTGCACGCACAAACATATATTATCATGCAGGAACATCCAGACTACTTGCAGTTGGACATCCCTATTTTCCTATTAAAAAACCTAACAATAACAAAATATTAGTTCCTAAAGTATCAGGATTACAATACAGGGTATTTAGAA");
            expect(fragments![0].type).toBe("mapped");
            let joined = "";
            for(let i = 0; i != fragments!.length; ++i)
                joined += fragments![i].seq;
    
            expect(joined).toEqual(read.SEQ);
        }

        else if(read.SEQ == "CTACACGACGCTCTTCCGATCTCTTGTGTAACTATTGTGTGATGCAACATAAATAAACTTATTGTTTCAACACCTACTAATTGTGTTGTGGTTATTCATTGTATATAAACTATATTTGCTACAATCTGTTTTTGTTTTATATATACTATAT")
        {
            expect(fragments).toBeDefined();
            expect(fragments!.length).toBe(3);
            expect(fragments![0].seq).toBe("CTACACG");
            expect(fragments![0].type).toBe("mapped");
            expect(fragments![1].seq).toBe("ACGCTCTTCCGATCT");
            expect(fragments![1].type).toBe("unmapped");
            expect(fragments![2].seq).toBe("CTTGTGTAACTATTGTGTGATGCAACATAAATAAACTTATTGTTTCAACACCTACTAATTGTGTTGTGGTTATTCATTGTATATAAACTATATTTGCTACAATCTGTTTTTGTTTTATATATACTATAT");
            expect(fragments![2].type).toBe("mapped");

            let joined = "";
            for(let i = 0; i != fragments!.length; ++i)
                joined += fragments![i].seq;
    
            expect(joined).toEqual(read.SEQ);
        }

        else if(read.SEQ == "ACGACGCTCTTCCGATCTAATAAACCTTATTGGTTACAACGAGCACAGGGCCACAATAATGGCATTTGTTGGGGTAACCAACTATTTGTTACTGTTGTTGATACTACACGCAGTACAAATATGTCATTATGTGCTGCCATATCTACTTCAG")
        {
            expect(fragments).toBeDefined();
            expect(fragments!.length).toBe(5);
            expect(fragments![0].seq).toBe("ACGA");
            expect(fragments![0].type).toBe("mapped");
            expect(fragments![1].seq).toBe("CG");
            expect(fragments![1].type).toBe("unmapped");
            expect(fragments![2].seq).toBe("CTCTTC");
            expect(fragments![2].type).toBe("mapped");
            expect(fragments![3].seq).toBe("CGATCT");
            expect(fragments![3].type).toBe("unmapped");
            expect(fragments![4].seq).toBe("AATAAACCTTATTGGTTACAACGAGCACAGGGCCACAATAATGGCATTTGTTGGGGTAACCAACTATTTGTTACTGTTGTTGATACTACACGCAGTACAAATATGTCATTATGTGCTGCCATATCTACTTCAG");
            expect(fragments![4].type).toBe("mapped");
            
            let joined = "";
            for(let i = 0; i != fragments!.length; ++i)
                joined += fragments![i].seq;
    
            expect(joined).toEqual(read.SEQ);
        }
    });

    expect(total).toBe(5378);
});