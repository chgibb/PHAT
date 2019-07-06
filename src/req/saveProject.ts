import * as fs from "fs";


import {getReadableAndWritable} from "./getAppPath";
import {ProjectManifest,getTarBallPath} from "./projectManifest";
import {getFolderSize} from "./getFolderSize";

const tarfs = require("tar-fs");
const mkdirp = require("mkdirp");

/**
 * Begins saving the project represented by proj. Incrementally calls cb with progress updates
 * 
 * @export
 * @param {ProjectManifest} proj 
 * @param {(totalBytesToSave : number, bytesSaved : number) => void} cb 
 * @returns {Promise<void>} 
 */
export function saveProject(
    proj : ProjectManifest,
    cb : (totalBytesToSave : number, bytesSaved : number) => void
) : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        mkdirp.sync(getReadableAndWritable("projects"));
        let projectTarBall = getTarBallPath(proj);

        const ostream = fs.createWriteStream(projectTarBall);
        let totalBytesToSave = getFolderSize(getReadableAndWritable("rt"));
        let cbInterval : NodeJS.Timer = setInterval(function()
        {
            //slight differences between size on disk and actual files sizes
            //results in bytesWritten occasionally being greater than totalBytestoSave
            if(ostream.bytesWritten <= totalBytesToSave)
                cb(totalBytesToSave,ostream.bytesWritten);
            else
                cb(totalBytesToSave,totalBytesToSave);
        },100);

        ostream.on("error",(error : string) => 
        {
            clearInterval(cbInterval);
            reject(error);
        });
        ostream.on("close",() => 
        {
            clearInterval(cbInterval);
            resolve();
        });
      
        let pack = tarfs.pack(getReadableAndWritable("rt")).pipe(ostream);
        pack.on("error",function(error : string)
        {
            clearInterval(cbInterval);
            reject(error);
        });
        pack.on("close",function()
        {
            clearInterval(cbInterval);
            resolve();
        });

    });
}

