/// <reference types="jest" />

import {evaluateCIGAR} from "./../lib/lib";

it(`should correctly extract CIGAR fragments 1`,() => {
    let res = evaluateCIGAR("ATCGATCGATCG","4M1I");

    expect(res).toBeDefined();

    expect(res!.length).toBe(1);
    expect(res![0]).toBe("A");
}); 