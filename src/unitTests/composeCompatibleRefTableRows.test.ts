/// <reference types="jest" />

import * as fs from "fs";

import { composeCompatibleRefTableRows } from "../req/renderer/containers/compatibleRefTable";
import { Fasta } from '../req/fasta';
import { LinkableRefSeq } from '../req/getLinkableRefSeqs';

jest.mock("fs");

it("should combine correct references",() => {
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

    ref1.uuid = fasta1.uuid;
    ref2.uuid = fasta2.uuid;

    let res = composeCompatibleRefTableRows(
        [fasta1,fasta2],
        [ref1,ref2]
    );

    expect(res.length).toBe(1);
    expect(res[0].fasta.alias).toBe(fasta2.alias);
    expect(res[0].fasta.sizeString).toBe(fasta2.sizeString);
});
