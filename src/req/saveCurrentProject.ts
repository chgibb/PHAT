import * as fs from "fs";

import * as mkdirp from "mkdirp";
const tarfs = require("tar-fs");

import {getReadableAndWritable} from "./getAppPath";
import {ProjectManifest} from "./projectManifest";

export function saveCurrentProject(proj : ProjectManifest) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        mkdirp.sync(getReadableAndWritable("projects"));
        let projectTarBall = getReadableAndWritable(`projects/${proj.uuid}`);
        const ostream = fs.createWriteStream(projectTarBall);
        ostream.on("error",(error : string) => {reject(error);});
        ostream.on("close",() => {
            resolve();
        });
      
        let pack = tarfs.pack(getReadableAndWritable("rt")).pipe(ostream);
        pack.on("error",function(err : string){
            reject(err);
        });
        pack.on("close",function(){
            resolve();
        })

    });
}

