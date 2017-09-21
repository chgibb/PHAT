import * as atomic from "./req/operations/atomicOperations";
import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import {ProjectManifest} from "./req/projectManifest";
import {openProject} from "./req//openProject";

let proj : ProjectManifest;
let externalProjectPath : string;
let flags : CompletionFlags = new CompletionFlags();

function progressCallBack(toUnpack : number,unPacked : number) : void
{
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : {toUnpack : toUnpack,unPacked : unPacked}
        }
    )
}
process.on
(
    "message",function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            proj = ev.data.proj;
            externalProjectPath = ev.data.externalProjectPath;
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }

        if(ev.run == true)
        {
            openProject(proj,progressCallBack,externalProjectPath).then(() => {
                flags.done = true;
                flags.failure = false;
                flags.success = true;
                process.send(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                    }
                );
                atomic.exitFork(0);
            }).catch((err) => {
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
        }
    }  
);
(process as NodeJS.EventEmitter).on("uncaughtException",function(err : string){
    console.log(err);
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

process.on("unhandledRejection",function(err : string){
    console.log(err);
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