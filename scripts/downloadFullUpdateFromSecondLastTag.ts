import * as fs from "fs";

const GitHubAPI = require("github-api");
const GitHubReleases = require("github-releases");

let isRightOS : RegExp;
if(process.platform == "linux")
    isRightOS = new RegExp("(linux)","i");
else if(process.platform == "win32")
    isRightOS = new RegExp("(win32)","i");

let isRightArch : RegExp = new RegExp("(x64)","i");

let isUpdateFull : RegExp = new RegExp("(update-full)","i");

let args = process.argv.slice(2);

let user = args[0];
let repo = args[1];
let currentTag = args[2];
let branch = args[3];

function getSecondLastTag(user : string,repo : string,branch : string,currentTag : string) : Promise<string>
{
    //copied almost verbatim from https://github.com/chgibb/PHATDocs/blob/master/scripts/getLastTag.js
    return new Promise<string>((resolve,reject) => {
        const ghapi = new GitHubAPI();
        let tag;
        //find last release for either beta/stable
        ghapi.getRepo(user,repo).listReleases().then((tagsRes : {data : Array<any>}) => {
            if(branch == "beta")
            {
                for(let i = 0; i != tagsRes.data.length; ++i)
                {
                    if(/beta/.test(tagsRes.data[i].tag_name) && tagsRes.data[i].tag_name != currentTag)
                    {
                        resolve(tagsRes.data[i].tag_name);
                    }
                }
            }
            else if(branch != "beta")
            {
                for(let i = 0; i != tagsRes.data.length; ++i)
                {
                    if(/beta/.test(tagsRes.data[i].tag_name) && tagsRes.data[i].tag_name != currentTag)
                        continue;
                    else
                    {
                        resolve(tagsRes.data[i].tag_name);
                    }
                }
            }
            reject();
        });
    });
}

function downloadFullUpdateFromTag(user : string,repo : string,tag : string) : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {
        let asset : any = await new Promise<any>(async (resolve,reject) => {
            let ghapi = new GitHubAPI();
            ghapi.getRepo(user,repo).listReleases().then((tagsRes : {data : Array<any>}) => {
                for(let i = 0; i != tagsRes.data.length; ++i)
                {
                    if(tagsRes.data[i].tag_name == tag)
                    {
                        for(let k = 0; k != tagsRes.data[i].assets.length; ++k)
                        {
                            if(
                                isUpdateFull.test(tagsRes.data[i].assets[k].name) &&
                                isRightOS.test(tagsRes.data[i].assets[k].name) &&
                                isRightArch.test(tagsRes.data[i].assets[k].name)
                            )
                            {
                                console.log(tagsRes.data[i].assets[k]);
                                //resolve(tagsRes.data[i].asset);
                            }
                        }
                    }
                }
            });
        });
        const ghr = new GitHubReleases({user : user,repo : repo});
        const ostream = fs.createWriteStream("phat-update-full");
        ghr.downloadAsset(asset,async (error : string,istream : fs.ReadStream) => {
            if(error)
                reject(error);
        });
    });
}

(async function(){
    let tag = await getSecondLastTag(user,repo,branch,currentTag);
    await downloadFullUpdateFromTag(user,repo,tag);
})();