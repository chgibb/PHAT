import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";

let flags : CompletionFlags = new CompletionFlags();

let logger : atomic.ForkLogger = new atomic.ForkLogger();
atomic.handleForkFailures(logger);


process.on("message",async function(ev : AtomicOperationForkEvent){
    if(ev.setData == true)
    {
        logger.logRecord = atomic.openLog(ev.name,ev.description);
        logger.logObject(ev);
        process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
        return;
    }

    if(ev.run == true)
    {
        flags.done = true;
        flags.success = true;
        atomic.closeLog(logger.logRecord,"success");
        process.send(<AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            logRecord : logger.logRecord
        });
        atomic.exitFork(0);
    }
});