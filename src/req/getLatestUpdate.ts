let GitHubAPI = require("github-api");
const pjson = require("./package.json");

import {versionIsGreaterThan,isBeta,sepBaseAndBeta} from "./versionIsGreaterThan";
import {getAppSettings,writeAppSettings} from "./appSettings";

let isRightOS : RegExp;
if(process.platform == "linux")
    isRightOS = new RegExp("(linux)","i");
else if(process.platform == "win32")
    isRightOS = new RegExp("(win32)","i");

let isRightArch : RegExp = new RegExp("(x64)","i");

let isUpdate : RegExp = new RegExp("(update)","i");

export interface Status
{
    status : number;
    msg : string;
    asset? : any;
    tag_name? : string;
}

//returns -1 on network/auth error
//returns 0 on success, includes release object and tag name
//returns 1 if a release is available but there is no update artifact for this platform
//returns 2 if there is no release available whose version is greater than the version in package.json
export function getLatestUpdate(userName : string,repo : string) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let ghapi = new GitHubAPI();
        ghapi.getRepo(userName,repo).listReleases(
            (error : string,result : any,request : any) => {
                if(error)
                    return reject(<Status>{status : -1,msg : error});
            }
        ).then((arg : any) => {
            let updateChannel = getAppSettings().updateChannel;
            for(let i = arg.data.length-1; i != -1; i--)
            {
                let greaterThan = versionIsGreaterThan(arg.data[i].tag_name,pjson.version)
            
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
                            isUpdate.test(arg.data[i].assets[k].name) &&
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
        }).catch((arg : any) => {
            return reject(arg);
        });
    });
}