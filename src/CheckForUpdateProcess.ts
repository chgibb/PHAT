import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import * as getUpdate from "./req/getLatestUpdate";

let flags : CompletionFlags = new CompletionFlags();

let connectivityTimeout : NodeJS.Timer = setTimeout(function()
{
    throw new Error("Took too long to determine network connectivity");
},5000);

process.on(
    "message",function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }
        if(ev.run == true)
        {
            getUpdate.getLatestUpdate("chgibb","PHAT").then((res : any) => 
            {
                clearTimeout(connectivityTimeout);
                flags.done = true;
                flags.success = true;
                process.send(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                        data : res
                    }
                );
                atomic.exitFork(0);
            }).catch((arg : any) => 
            {
                clearTimeout(connectivityTimeout);
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
                atomic.exitFork(1);
            });
        }
    }
);
(process as NodeJS.EventEmitter).on("uncaughtException",function(err : Error)
{
    clearTimeout(connectivityTimeout);
    console.log(err);
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err.message
        }
    );
    atomic.exitFork(1);
});
process.on("unhandledRejection",function(err : Error)
{
    clearTimeout(connectivityTimeout);
    console.log(err);
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err.message
        }
    );
    atomic.exitFork(1);
});