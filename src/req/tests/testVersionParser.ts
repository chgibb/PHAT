import {versionIsGreaterThan} from "./../versionIsGreaterThan";
interface VersionTests
{
    left : string;
    right : string;
    expected : boolean;
}
let versionTests = new Array<VersionTests>();
versionTests.push({
    left : "0.0.2",
    right : "0.0.1",
    expected : true
});
versionTests.push({
    left : "0.0.1",
    right : "0.0.2",
    expected : false
});

versionTests.push({
    left : "0.0.1-beta.0",
    right : "0.0.2",
    expected : false
});
versionTests.push({
    left : "0.0.1-beta.1",
    right : "0.0.1-beta.0",
    expected : true
});
versionTests.push({
    left : "1.0.0",
    right : "1.0.0",
    expected : false
});
versionTests.push({
    left : "1.10.0",
    right : "1.56.0",
    expected : false
});
versionTests.push({
    left : "1.10.0-beta.5",
    right : "1.10.0",
    expected : false
});
versionTests.push({
    left : "1.10.0",
    right : "1.11.0",
    expected : false
});
versionTests.push({
    left : "1.11.0",
    right : "1.10.2",
    expected : true
});
export async function testVersionParser() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        for(let i = 0; i != versionTests.length; ++i)
        {
            let res = versionIsGreaterThan(versionTests[i].left,versionTests[i].right);
            console.log(`Expected ${versionTests[i].left} > ${versionTests[i].right} ${versionTests[i].expected}`);
            console.log(`Got ${res}`);
            if(res != versionTests[i].expected)
                reject();
        }

        resolve();
    });
}