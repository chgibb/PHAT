/// <reference types="jest" />

import {parseRead} from "./../lib/lib";

it(`should not parse header 1`,() => {
    expect(parseRead("@HD	VN:1.0	SO:unsorted")).toBeUndefined();
});