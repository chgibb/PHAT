import * as fs from "fs";
import * as cp from "child_process";

let GitHubReleases = require("github-releases");
const tarfs = require("tar-fs");
const tarStream = require("tar-stream");
const gunzip = require("gunzip-maybe");

import {AtomicOperationForkEvent,AtomicOperationIPC,CompletionFlags} from "./req/atomicOperationsIPC";

let flags : CompletionFlags = new CompletionFlags();

let asset : any;
let token : string;
process.on
(
    "message",function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            asset = ev.data.asset;
            token = ev.data.token;
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }
        if(ev.run == true)
        {
            let ghr = new GitHubReleases({user : "chgibb",repo : "PHAT",token : token});
            ghr.downloadAsset(asset,(error : string,istream : fs.ReadStream) => {
                if(error)
                    throw new Error(error);
                let progress = 0;
                istream.on("data",(chunk : Buffer) => {
                    progress += chunk.length;
                    process.send(
                        <AtomicOperationForkEvent>{
                            update : true,
                            data : {downloadProgress:progress},
                            flags : flags
                        }
                    );
                });
                const ostream = fs.createWriteStream("phat.update");
                istream.pipe(ostream);
                istream.on("error",(error : string) => {throw new Error(error);});
                ostream.on("error",(error : string) => {throw new Error(error);});
                ostream.on("close",() => {

                    flags.done = true;
                    flags.success = true;
                    flags.failure = false;
                    process.send(
                        <AtomicOperationForkEvent>{
                            update : true,
                            flags : flags,
                        }
                    );
                    /*
                        child_process.spawn()ing detached processes on Linux is completely broken.
                        installUpdateProcess on Linux will fork() fork() and execl() python installUpdateProcess.py to actually unpack the update.
                        cp.spawnSync will return after the first fork().

                        For Windows, we call into ICSharpCode's C# archive library to unpack the update and then restart PHAT.
                    */
                    if(process.platform == "linux")
                        cp.spawnSync("resources/app/installUpdateProcess");
                    if(process.platform == "win32")
                    {
                        let installer = cp.spawn(
                            "resources/app/installUpdateProcess.exe",<Array<string>>[],
                            <cp.SpawnOptions>{
                                detached : true,
                                stdio : "ignore"
                            }
                        );
                        installer.unref();
                    }
                    process.exit(0);
                   

                    /*let totalFiles = 0;
                    let countedFiles = 0;
                    let unPackedFiles = 0;

                    let countFiles = tarStream.extract();
                    countFiles.on(
                        "entry",(header : any,stream : any,next : () => void) => {
                            if(header)
                            {
                                totalFiles++;
                            }
                            stream.on("end",() => {
                                next();
                            });
                            stream.resume();
                        }
                    );
                    countFiles.on("finish",() => {
                        process.send(
                            <AtomicOperationForkEvent>{
                                update : true,
                                data : {totalFiles:totalFiles},
                                flags : flags
                            }
                        );
                        ///if(process.platform == "linux")
                       // {
                      //      fs.renameSync("phat","oldphat");
                      //  }
                        let extract = tarfs.extract("./../phat-linux-x64",{
                            ignore : (name : string) => {
                                if(name == "newphat")
                                {
                                    fs.renameSync("phat","newphat");
                                    fs.unlinkSync("newphat");
                                }
                                if(name == "newlibnode.so")
                                {
                                    fs.renameSync("libnode.so","newlibnode.so");
                                    fs.unlinkSync("newlibnode.so");
                                }
                                unPackedFiles++;
                                process.send(
                                    <AtomicOperationForkEvent>{
                                        update : true,
                                        data : {unPackedFiles:unPackedFiles},
                                        flags : flags
                                    }
                                );
                                
                                return false;
                            }
                        });
                        extract.on("finish",() => {
                            flags.done = true;
                            flags.success = true;
                            flags.failure = false;
                            process.send(
                                <AtomicOperationForkEvent>{
                                    update : true,
                                    flags : flags,
                                }
                            );
                            fs.unlinkSync("oldphat");
                            process.exit(0);
                        });
                        let unPackStream = fs.createReadStream("phat.update").pipe(gunzip()).pipe(extract);
                    });
                    fs.createReadStream("phat.update").pipe(gunzip()).pipe(countFiles);*/
                });
            });
        }
    }
);
process.on("uncaughtException",function(err : string){
    console.log("ERROR "+err);
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err
        }
    );
    process.exit(1);
});
process.on("unhandledRejection",function(err : string){
    console.log("ERROR "+err);
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err
        }
    );
    process.exit(1);
});