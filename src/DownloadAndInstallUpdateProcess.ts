import * as fs from "fs";
import * as cp from "child_process";


import * as atomic from "./req/operations/atomicOperations";
import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import {getReadable} from "./req/getAppPath";

let GitHubReleases = require("github-releases");

let flags : CompletionFlags = new CompletionFlags();

let asset : any;
process.on
(
    "message",function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            asset = ev.data.asset;
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }
        if(ev.run == true)
        {
            let ghr = new GitHubReleases({user : "chgibb",repo : "PHAT"});
            ghr.downloadAsset(asset,(error : string,istream : fs.ReadStream) => 
            {
                if(error)
                    throw new Error(error);
                let progress = 0;
                istream.on("data",(chunk : Buffer) => 
                {
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
                istream.on("error",(error : string) => 
                {
                    throw new Error(error);
                });
                ostream.on("error",(error : string) => 
                {
                    throw new Error(error);
                });
                ostream.on("close",() => 
                {

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
                        cp.spawnSync(getReadable("installUpdateProcess"));
                    if(process.platform == "win32")
                    {
                        let installer = cp.spawn(
                            getReadable("installUpdateProcess.exe"),<Array<string>>[],
                            <cp.SpawnOptions>{
                                detached : true,
                                stdio : "ignore"
                            }
                        );
                        installer.unref();
                    }
                    atomic.exitFork(0);

                });
            });
        }
    }
);
(process as NodeJS.EventEmitter).on("uncaughtException",function(err : string)
{
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
    atomic.exitFork(1);
});
process.on("unhandledRejection",function(err : string)
{
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
    atomic.exitFork(1);
});