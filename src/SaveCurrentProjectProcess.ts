import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import {ProjectManifest} from "./req/projectManifest";
import {saveCurrentProject} from "./req//saveCurrentProject";

let proj : ProjectManifest;
let flags : CompletionFlags = new CompletionFlags();
process.on
(
    "message",function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            proj = ev.data;
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }

        if(ev.run == true)
        {
            saveCurrentProject(proj).then(() => {
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
