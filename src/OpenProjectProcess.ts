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
                process.exit(0);
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
                process.exit(1);
            });
        }
    }  
);
process.on("uncaughtException",function(err : string){
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