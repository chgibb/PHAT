const fse = require("fs-extra");

import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData,getUnSortedBam} from "./req/alignData";

import {samToolsSort} from "./req/operations/RunAlignment/samToolsSort";

let flags : CompletionFlags = new CompletionFlags();
let align : AlignData = new AlignData();
let bamPath = "";
let progressMessage = "Sorting BAM";

let logger : atomic.ForkLogger = new atomic.ForkLogger();
atomic.handleForkFailures(logger);

function update() : void
{
    let update = <AtomicOperationForkEvent>{
        update : true,
        flags : flags,
        progressMessage : progressMessage,
        data : {
            alignData : align
        }
    };
    if(flags.done)
    {
        if(flags.success)
        {
            atomic.closeLog(logger.logRecord,"success");
            update.logRecord = logger.logRecord;
        }
        else if(flags.failure)
        {   
            atomic.closeLog(logger.logRecord,"failure");
            update.logRecord = logger.logRecord;
        }
    }
    logger.logObject(update);
    process.send(update);
}
process.on(
    "message",function(ev : AtomicOperationForkEvent){
        if(ev.setData == true)
        {
            logger.logRecord = atomic.openLog(ev.name,ev.description);
            bamPath = ev.data.bamPath;
            process.send(<AtomicOperationForkEvent>{
                finishedSettingData : true
            });
        }
        if(ev.run == true)
        {
            (async function(){
                progressMessage = "Copying BAM";
                await new Promise<void>((resolve,reject) => {
                    fse.copySync(bamPath,getUnSortedBam(align));
                    resolve();
                });
                progressMessage = "Sorting BAM";
                await samToolsSort(align,logger);

                flags.done = true
                flags.success = true;
                update();
                process.exit(0);
            })();
        }
    }
);