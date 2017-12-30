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
        ostream.on("error",(error : string) => {
            reject(error);
        });
        ostream.on("close",() => {
            resolve();
        });
      
        let pack = tarfs.pack(getReadableAndWritable("rt")).pipe(ostream);
        pack.on("error",function(error : string){
            reject(error);
        });
        pack.on("close",function(){
            resolve();
        })

    });
}

