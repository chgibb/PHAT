const semver = require("semver");

let getBetaTag = /-beta\.[\d]+/;
let getBetaVersion = /[\d]+/;
let getBaseVersion = /[\d]+\.[\d]+\.[\d]+/;

interface Version
{
    base : string;
    beta : number;
}

/**
 * Returns true if the given version string has a beta tag
 *
 * @export
 * @param {string} version - Semver string
 * @returns {boolean}
 */
export function isBeta(version : string) : boolean
{
    if(getBetaTag.test(version))
        return true;
    else if(/beta/.test(version))
    {
        throw new Error("Likely misspelled prerelease tag");
    }
    return false;
}

/**
 * Split apart semver string and beta tag
 *
 * @export
 * @param {string} version - Semver string
 * @returns {Version}
 */
export function sepBaseAndBeta(version : string) : Version
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
/**
 * Returns true if l is a highver version than r
 *
 * @export
 * @param {string} l - Semver string
 * @param {string} r - Semver string
 * @returns {boolean}
 */
export function versionIsGreaterThan(l : string,r : string) : boolean
{
    let lVersions = sepBaseAndBeta(l);
    let rVersions = sepBaseAndBeta(r);

    let isLBaseLarger = semver.satisfies(`${lVersions.base}`,`>${rVersions.base}`);
    let isLBaseSame = semver.satisfies(`${lVersions.base}`,`>=${rVersions.base}`);
    let isLBetaLarger = lVersions.beta > rVersions.beta;

    //l is a beta but r is not
    if(rVersions.beta === undefined && lVersions.beta !== undefined)
        return false;

    //r is a beta, l is not. Only compare their base verions
    else if(rVersions.beta !== undefined && lVersions.beta === undefined)
    {
        //x.y.z is considered greater than x.y.z-beta.a
        if(isLBaseLarger || isLBaseSame)
            return true;
    }

    
    //both are betas
    else if(rVersions.beta !== undefined && lVersions.beta !== undefined)
    {
        if(isLBaseSame && isLBetaLarger)
            return true;

        else if(isLBaseLarger)
            return true;
    }

    //neither are betas
    else if(rVersions.beta === undefined && lVersions.beta === undefined)
    {
        return semver.satisfies(`${lVersions.base}`,`>${rVersions.base}`);
    }
    return false;
}