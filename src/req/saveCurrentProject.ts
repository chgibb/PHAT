import * as fs from "fs";

const mkdirp = require("mkdirp");
const tarfs = require("tar-fs");

import {getReadableAndWritable} from "./getAppPath";
import {ProjectManifest,getTarBallPath} from "./projectManifest";
import {getFolderSize} from "./getFolderSize";

export function saveCurrentProject(
    proj : ProjectManifest,
    cb : (totalBytesToSave : number, bytesSaved : number) => void
) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        mkdirp.sync(getReadableAndWritable("projects"));
        let projectTarBall = getTarBallPath(proj);

        const ostream = fs.createWriteStream(projectTarBall);
        let totalBytesToSave = getFolderSize(getReadableAndWritable("rt"));
        let cbInterval : NodeJS.Timer = setInterval(function(){
            //slight differences between size on disk and actual files sizes
            //results in bytesWritten occasionally being greater than totalBytestoSave
            if(ostream.bytesWritten <= totalBytesToSave)
                cb(totalBytesToSave,ostream.bytesWritten);
            else
                cb(totalBytesToSave,totalBytesToSave);
        },100);

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

