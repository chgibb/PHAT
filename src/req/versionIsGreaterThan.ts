const semver = require("semver");

let getBetaTag = /-beta\.[\d]+/;
let getBetaVersion = /[\d]+/;
let getBaseVersion = /[\d]+\.[\d]+\.[\d]+/;

interface Version
{
    base : string;
    beta : number;
}

function isBeta(version : string) : boolean
{
    if(getBetaTag.test(version))
        return true;
    return false;
}

function sepBaseAndBeta(version : string) : Version
{
    if(isBeta(version))
    {
        let baseVersion = getBaseVersion.exec(version)[0];
        let betaTag = getBetaTag.exec(version)[0];
        let betaVersion = getBetaVersion.exec(betaTag)[0];
        return <Version>{
            base : baseVersion,
            beta : parseInt(betaVersion)};
    }
    else
        return <Version>{
            base : version,
            beta : undefined
        };
}
export function versionIsGreaterThan(l : string,r : string) : boolean
{
    let lVersions = sepBaseAndBeta(l);
    let rVersions = sepBaseAndBeta(r);

    //l is a beta but r is not
    if(rVersions.beta === undefined && lVersions.beta !== undefined)
        return false;

    //r is a beta, l is not. Only compare their base verions
    else if(rVersions.beta !== undefined && lVersions.beta === undefined)
        return semver.satisfies(`${l[0]}`,`>${r[0]}`);

    

    else if(rVersions.beta !== undefined && lVersions.beta !== undefined)
    {
        let isLBaseLarger = semver.satisfies(`${lVersions.base}`,`>${rVersions.base}`);
        let isLBaseSame = semver.satisfies(`${lVersions.base}`,`>=${rVersions.base}`);
        let isLBetaLarger = lVersions.beta > rVersions.beta;

        if(isLBaseSame && isLBaseLarger)
            return true;

        else if(isLBaseLarger)
            return true;
    }
    return false;
}