import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as getUpdate from "./req/getLatestUpdate";

let flags : CompletionFlags = new CompletionFlags();
let token : string = "";

process.on
(
    "message",function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            token = ev.data.token;
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }
        if(ev.run == true)
        {
            getUpdate.getLatestUpdate("chgibb","PHAT",token).then((res : any) => {
                flags.done = true;
                flags.success = true;
                process.send(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                        data : res
                    }
                );
                process.exit(0);
            }).catch((arg : any) => {
                console.log(arg);
                flags.done = true;
                flags.success = false;
                flags.failure = true;
                process.send(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                        data : arg
                    }
                );
                process.exit(1);
            });
        }
    }
);
process.on("uncaughtException",function(err : string){
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
    process.exit(1);
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
    process.exit(1);
});