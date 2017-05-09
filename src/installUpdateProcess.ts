import * as fs from "fs";

const tarfs = require("tar-fs");
const tarStream = require("tar-stream");
const gunzip = require("gunzip-maybe");

let totalFiles = 0;
let countedFiles = 0;
process.on
(
    "message",function(data : any)
    {
        if(data.target)
        {
            if(totalFiles == 0 && countedFiles == 0)
            {
                let countFiles = tarStream.extract();
                countFiles.on
                (
                    "entry",function(header : any,stream : any,next : any)
                    {
                        if(header)
                            totalFiles++;
                        stream.on
                        (
                            "end",function()
                            {
                                next();
                            }
                        );
                        stream.resume();
                    }
                );
                countFiles.on
                (
                    "finish",function()
                    {
                        process.send({totalFiles : totalFiles});
                    }
                );
                try
                {
                    fs.createReadStream(data.target).pipe(gunzip()).pipe(countFiles);
                }
                catch(err){}
            }
        }
    }
);

/*
const fs = require("fs");

//Adapted from https://github.com/roblourens/vscode-ripgrep/blob/master/dist/download.js
let GitHub = require("github-api");
let GitHubReleases = require("github-releases");

let ghapi = new GitHub({token : ""});

function getLatest()
{
    let totalSize = 0;
    return new Promise((resolve,reject) => {
        ghapi.getRepo("chgibb","PHAT").listReleases((error,result,request)=>{
            if(error)
                console.log(error);
        }).then((arg)=>{
            //console.log(arg.data);
            console.log(arg.data[0].tag_name);
            
            let ghr = new GitHubReleases({user : "chgibb",repo : "PHAT",token : ""});
            const asset = arg.data[0].assets.find(asset => asset.name === "phat-linux-x64.tar.gz");
            totalSize = asset.size;
            //console.log(JSON.stringify(asset,undefined,4));
            ghr.getReleases({tag_name : arg.data[0].tag_name},function(err,releases){
                if(err)
                    return reject(err);
                //console.log(releases);
                ghr.downloadAsset(asset,(error,istream) => {
                    if(error)
                        return reject(error);
                    let progress = 0;
                    istream.on("data",(chunk) => {
                        progress += chunk.length;
                        console.log(progress+"/"+totalSize);
                    });
                    const ostream = fs.createWriteStream("phat-linux-x64.tar.gz");
                    istream.pipe(ostream);
                    istream.on("error",reject);
                    ostream.on("error",reject);
                    ostream.on("close",() =>{resolve("")});
                });
            });
        }).catch((arg)=>{
            console.log("catch "+arg);
        });
    });
}


getLatest().catch((err)=>{console.log(err+"from catch");});


*/