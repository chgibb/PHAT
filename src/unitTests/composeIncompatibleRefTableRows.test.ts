/// <reference types="jest" />

import * as fs from "fs";

import {composeIncompatibleRefTableRows} from "../req/renderer/containers/incompatibleRefTable";
import {Fasta} from "../req/fasta";
import {LinkableRefSeq} from "../req/getLinkableRefSeqs";

jest.mock("fs");

it("should combine correct references",() => 
{
    (fs.statSync as any).mockReturnValue({
        size : 0
    });

    let fasta1 = new Fasta("first");
    let fasta2 = new Fasta("second");

    let ref1 = new LinkableRefSeq();
    ref1.reason = "1";
    ref1.longReason = "one";
    ref1.linkable = false;

    let ref2 = new LinkableRefSeq();
    ref2.reason = "2";
    ref2.longReason = "two";
    ref2.linkable = true;

    fasta1.uuid = ref1.uuid;

    let res = composeIncompatibleRefTableRows(
        [fasta1,fasta2],
        [ref1,ref2]
    );

    expect(res.length).toBe(1);
    expect(res[0].alias).toBe(fasta1.alias);
    expect(res[0].sizeString).toBe(fasta1.sizeString);
    expect(res[0].reason).toBe(ref1.reason);
    expect(res[0].longReason).toBe(ref1.longReason);
});
