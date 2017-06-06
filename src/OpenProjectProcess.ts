import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import {ProjectManifest} from "./req/projectManifest";
import {openProject} from "./req//openProject";

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
            openProject(proj).then(() => {
                flags.done = true;
                flags.failure = false;
                flags.success = true;
                process.send(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                    }
                );
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