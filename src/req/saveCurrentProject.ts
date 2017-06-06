import * as fs from "fs";

import * as mkdirp from "mkdirp";
const tarfs = require("tar-fs");
const tarStream = require("tar-stream");

import {ProjectManifest,manifestsPath} from "./projectManifest";

export function saveCurrentProject(proj : ProjectManifest) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        mkdirp.sync("resources/app/projects");
        const ostream = fs.createWriteStream(proj.tarBall);
        ostream.on("error",(error : string) => {reject(error);});
        ostream.on("close",() => {
            resolve();
        });
      
        let pack = tarfs.pack("./resources/app/rt").pipe(ostream);
        pack.on("error",function(err : string){
            reject(err);
        });
        pack.on("close",function(){
            resolve();
        })

    });
}

