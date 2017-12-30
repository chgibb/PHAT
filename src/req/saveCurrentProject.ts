import * as fs from "fs";

const mkdirp = require("mkdirp");
const tarfs = require("tar-fs");

import {getReadableAndWritable} from "./getAppPath";
import {ProjectManifest,getTarBallPath} from "./projectManifest";

export function saveCurrentProject(
    proj : ProjectManifest,
    cb : (totalBytesToSave : number, bytesSaved : number) => void
) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        mkdirp.sync(getReadableAndWritable("projects"));
        let projectTarBall = getTarBallPath(proj);

        const ostream = fs.createWriteStream(projectTarBall);

        let cbInterval : NodeJS.Timer = setInterval(function(){
            cb(0,ostream.bytesWritten);
        },1000);
        
        ostream.on("error",(error : string) => {
            clearInterval(cbInterval);
            reject(error);
        });
        ostream.on("close",() => {
            clearInterval(cbInterval);
            resolve();
        });
      
        let pack = tarfs.pack(getReadableAndWritable("rt")).pipe(ostream);
        pack.on("error",function(error : string){
            clearInterval(cbInterval);
            reject(error);
        });
        pack.on("close",function(){
            clearInterval(cbInterval);
            resolve();
        })

    });
}

