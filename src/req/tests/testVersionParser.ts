import {versionIsGreaterThan} from "./../versionIsGreaterThan";
interface VersionTests
{
    left : string;
    right : string;
    expected : boolean;
    invalid? : boolean;
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
versionTests.push({
    left : "0.01beta1",
    right : "0.0.2",
    expected : false,
    invalid : true
});
versionTests.push({
    left : "0.0.2",
    right : "0.0.1-beta1",
    expected : true,
    invalid : true
});
versionTests.push({
    left : "1.0.0-beta.1",
    right : "0.0.2",
    expected : false,
});
versionTests.push({
    left : "1.0.0-beta.1",
    right : "0.1.78",
    expected : false,
});
versionTests.push({
    left : "1.0.0-beta.2",
    right : "0.1.78-beta.57",
    expected : true,
});
versionTests.push({
    left : "1.0.0-beta.1",
    right : "1.0.1",
    expected : false,
});
versionTests.push({
    left : "1.0.0-beta.570",
    right : "1.0.0-beta.569",
    expected : true,
});
versionTests.push({
    left : "1.0.0-beta.5",
    right : "0.9.56",
    expected : false
});
versionTests.push({
    left : "1.0.0-beta.569",
    right : "1.0.0-beta.570",
    expected : false
});
export async function testVersionParser() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        for(let i = 0; i != versionTests.length; ++i)
        {
            try
            {
                console.log(`Expected ${versionTests[i].left} > ${versionTests[i].right} ${versionTests[i].expected}`);
                let res = versionIsGreaterThan(versionTests[i].left,versionTests[i].right);
                console.log(`Got ${res}`);
                if(versionTests[i].invalid)
                {
                    console.log("Was not invalid as expected");
                    reject();
                }
                if(res != versionTests[i].expected)
                    reject();
            }
            catch(err)
            {
                if(versionTests[i].invalid)
                {
                    console.log(`Invalid as expected`);
                }
                else
                {
                    console.log(`Was unexpectedly invalid`);
                    reject();
                }
            }
        }

        resolve();
    });
}