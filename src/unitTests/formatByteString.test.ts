/// <reference types="jest" />

import formatByteString from "./../req/renderer/formatByteString";

it("should format byte string correctly 1",() => 
{
    expect(formatByteString(100)).toBe("100B");
});

it("should format byte string correctly 2",() => 
{
    expect(formatByteString(0)).toBe("0");
});

it("should format byte string correctly 3",() => 
{
    expect(formatByteString(-500)).toBe("0");
});

it("should format byte string correctly 4",() => 
{
    expect(formatByteString(2000)).toBe("1.95kB");
});

it("should format byte string correctly 5",() => 
{
    expect(formatByteString(200000)).toBe("195.31kB");
});

it("should format byte string correctly 6",() => 
{
    expect(formatByteString(2000000)).toBe("1.91MB");
});

it("should format byte string correctly 7",() => 
{
    expect(formatByteString(20000000)).toBe("19.07MB");
});

it("should format byte string correctly 8",() => 
{
    expect(formatByteString(2000000000)).toBe("1.86GB");
});

it("should format byte string correctly 9",() => 
{
    expect(formatByteString(20000000000)).toBe("18.63GB");
});

it("should format byte string correctly 10",() => 
{
    expect(formatByteString(2000000000000)).toBe("1.82TB");
});
