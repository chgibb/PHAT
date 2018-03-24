/// <reference types="jest" />

import formatByteString from "./../req/renderer/formatByteString";

it(`should format byte string correctly 1`,() => {
    expect(formatByteString(100)).toBe("100B");
});