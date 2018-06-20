/// <reference types="jest" />

import {evaluateCIGAR} from "./../lib/lib";

it(`should correctly extract CIGAR fragments 1`,() => {
    let seq = "ATCGATCGATCG";
    let res = evaluateCIGAR(
        seq,
        "4M1I"
    );

    expect(res).toBeDefined();

    expect(res!.length).toBe(3);

    expect(res![0].seq).toBe("ATCG");
    expect(res![0].type).toBe("mapped");

    expect(res![1].seq).toBe("A");
    expect(res![1].type).toBe("unmapped");

    expect(res![2].seq).toBe("TCGATCG");
    expect(res![2].type).toBe("remainder");

    let joined = "";
    for(let i = 0; i != res!.length; ++i)
        joined += res![i].seq;
    
    expect(joined).toEqual(seq);
}); 

it(`should correctly extract CIGAR fragments 2`,() => {
    let seq = "AACACCTGCAGAAACTGGAGGGCATTTTACACTTTCATCATCCACTATTAGTACACATAATTATGAAGAAATTCCTATGGATACATTTATTGTTAGCACAAACCCTAACACAGTAACTAGTAGCACACCCATACCAGGGTCTCGCCCAGTG";
    let res = evaluateCIGAR(
        seq,
        "151M"
    );

    expect(res).toBeDefined();

    expect(res!.length).toBe(1);
    expect(res![0].seq).toBe("AACACCTGCAGAAACTGGAGGGCATTTTACACTTTCATCATCCACTATTAGTACACATAATTATGAAGAAATTCCTATGGATACATTTATTGTTAGCACAAACCCTAACACAGTAACTAGTAGCACACCCATACCAGGGTCTCGCCCAGTG");
    expect(res![0].type).toBe("mapped");

    let joined = "";
    for(let i = 0; i != res!.length; ++i)
        joined += res![i].seq;
    
    expect(joined).toEqual(seq);
});

it(`should correctly extract CIGAR fragments 3`,() => {
    let seq = "CGATCTGAAACTAGTTTTATTGATGCTGGTGCACCAACATCTGTACCTTCCATTCCCCCAGATGTATCAGGATTTAGTATTACTACTTCAACTGATACCACACCTGCTATATTAGATATTAATAATACTGTTACTACTGTTACTACACATA";
    let res = evaluateCIGAR(
        seq,
        "4M2I145M"
    );

    expect(res).toBeDefined();

    expect(res!.length).toBe(3);

    expect(res![0].seq).toBe("CGAT");
    expect(res![0].type).toBe("mapped");

    let joined = "";
    for(let i = 0; i != res!.length; ++i)
        joined += res![i].seq;
    
    expect(joined).toEqual(seq);
});

it(`should correctly extract CIGAR fragments 4`,() => {
    let seq = "GAAACTAGTTTTATTGATGCTGGTGCACCAACATCTGTACCTTCCATTCCCCCAGATGTATCAGGATTTAGTATTACTACTTCAACTGATACCACACCTGCTATATTAGATATTAATAATACTGTTACTACTGTTACTACACATAAGATCG";
    let res = evaluateCIGAR(
        seq,
        "146M1D5M"
    );

    expect(res!.length).toBe(2);

    let joined = "";
    for(let i = 0; i != res!.length; ++i)
        joined += res![i].seq;
    
    expect(joined).toEqual(seq);
});

it(`should correctly extract CIGAR fragments 5`,() => {
    let res = evaluateCIGAR(
        "GAAACTAGTTTTATTGATGCTGGTGCACCAACATCTGTACCTTCCATTCCCCCAGATGTATCAGGATTTAGTATTACTACTTCAACTGATACCACACCTGCTATATTAGATATTAATAATACTGTTACTACTGTTACTACACATAAGATCG","*");

    expect(res).toBeUndefined();
});

it(`should correctly extract CIGAR fragments 6`,() => {
    let res = evaluateCIGAR(
        "GAAACTAGTTTTATTGATGCTGGTGCACCAACATCTGTACCTTCCATTCCCCCAGATGTATCAGGATTTAGTATTACTACTTCAACTGATACCACACCTGCTATATTAGATATTAATAATACTGTTACTACTGTTACTACACATAAGATCG",
        "0"
    );

    expect(res).toBeUndefined();
});

it(`should correctly extract CIGAR fragments 7`,() => {
    function evaluate()
    {
        evaluateCIGAR(
            "CGATCTGAAACTAGTTTTATTGATGCTGGTGCACCAACATCTGTACCTTCCATTCCCCCAGATGTATCAGGATTTAGTATTACTACTTCAACTGATACCACACCTGCTATATTAGATATTAATAATACTGTTACTACTGTTACTACACAT",
            "4M2I145M"
        );
    }
    expect(evaluate).toThrow();

});