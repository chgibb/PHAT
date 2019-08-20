import {versionIsGreaterThan,isBeta,sepBaseAndBeta} from "./versionIsGreaterThan";
import {getAppSettings,writeAppSettings} from "./appSettings";
import {getReadable} from "./getAppPath";

const jsonFile = require("jsonfile");

let isRightOS : RegExp;
if(process.platform == "linux")
    isRightOS = new RegExp("(linux)","i");
else if(process.platform == "win32")
    isRightOS = new RegExp("(win32)","i");

let isRightArch : RegExp = new RegExp("(x64)","i");

let isUpdateDiff : RegExp = new RegExp("(update-diff)","i");

export interface Status
{
    status : number;
    msg : string;
    asset? : any;
    tag_name? : string;
}

/**
 * Retrieve update status. 
 * Returns -1 on network or auth error
 * Returns 0 on success
 * Returns 1 if a release is available but no update artifact for this platform is available
 * Returns 2 if no release is available whose version greater than that in package.json
 *
 * @export
 * @param {string} userName - Github username
 * @param {string} repo - Github repo
 * @returns {Promise<Status>}
 */
export function getLatestUpdate(userName : string,repo : string) : Promise<Status>
{
    let GitHubAPI = require("github-api");
    const pjson = jsonFile.readFileSync(getReadable("package.json"));
    
    return new Promise<Status>((resolve,reject) => 
    {
        let ghapi = new GitHubAPI();
        ghapi.getRepo(userName,repo).listReleases(
            (error : string,result : any,request : any) => 
            {
                if(error)
                    return reject(<Status>{status : -1,msg : error});
            }
        ).then((arg : any) => 
        {
            let updateChannel = getAppSettings()!.updateChannel;
            for(let i = arg.data.length-1; i != -1; i--)
            {
                let greaterThan = versionIsGreaterThan(arg.data[i].tag_name,pjson.version);
            
                if(!greaterThan && updateChannel == "beta")
                {
                    
                    if(
                        !isBeta(pjson.version) && 
                        arg.data[i].tag_name != pjson.version && 
                        sepBaseAndBeta(pjson.version).base != sepBaseAndBeta(arg.data[i].tag_name).base
                    )
                    {
                        greaterThan = versionIsGreaterThan(arg.data[i].tag_name,`${pjson.version}-beta.0`);
                    }
                }
                if(greaterThan)
                {
                    for(let k = 0; k != arg.data[i].assets.length; ++k)
                    {
                        if(
                            isUpdateDiff.test(arg.data[i].assets[k].name) &&
                            isRightOS.test(arg.data[i].assets[k].name) &&
                            isRightArch.test(arg.data[i].assets[k].name)
                        )
                        {
                            return resolve(
                                <Status>{
                                    status : 0,
                                    msg : "Release is available",
                                    asset : arg.data[i].assets[k],
                                    tag_name : arg.data[i].tag_name
                                }
                            );
                        }
                    }
                    return reject(<Status>{status : 1,msg : "No update for platform"});
                }
            }
            return reject(<Status>{status : 2,msg : "No valid release"});
        }).catch((arg : any) => 
        {
            return reject(arg);
        });
    });
}