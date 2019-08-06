import * as atomic from "./req/operations/atomicOperations";
import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import {ProjectManifest} from "./req/projectManifest";
import {saveProject} from "./req/saveProject";

let proj : ProjectManifest;
let flags : CompletionFlags = new CompletionFlags();
atomic.handleForkFailures();
process.on(
    "message",async function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            proj = ev.data;
            process.send!(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }

        if(ev.run == true)
        {
            try
            {
                await saveProject(proj,function(totalBytesToSave : number,bytesSaved : number)
                {
                    process.send!!(
                        <AtomicOperationForkEvent>{
                            update : true,
                            flags : flags,
                            data : {totalBytesToSave : totalBytesToSave,bytesSaved : bytesSaved}
                        }
                    );
                });
                flags.done = true;
                flags.failure = false;
                flags.success = true;
                process.send!(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                    }
                );
                atomic.exitFork(0);
            }
            catch(err)
            {
                flags.done = true;
                flags.failure = true;
                flags.success = false;
                process.send!(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                        data : err
                    }
                );
                atomic.exitFork(1);
            }
        }
    }  
);

