const fse = require("fs-extra");

import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData,getUnSortedBam,getSam} from "./req/alignData";
import trimPath from "./req/trimPath";

import {samToolsView} from "./req/operations/RunAlignment/samToolsView";
import {samToolsSort} from "./req/operations/RunAlignment/samToolsSort";
import {samToolsFlagStat} from "./req/operations/InputBamFile/samToolsFlagStat";
import {samToolsIndex} from "./req/operations/RunAlignment/samToolsIndex";
import {samToolsIdxStats} from "./req/operations/RunAlignment/samToolsIdxStats";

let flags : CompletionFlags = new CompletionFlags();
let align : AlignData = new AlignData();
align.isExternalAlignment = true;
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
            align.alias = trimPath(bamPath);
            process.send(<AtomicOperationForkEvent>{
                finishedSettingData : true
            });
        }
        if(ev.run == true)
        {
            (async function(){
                let isSam = false;
                if(bamPath.split(".").pop() == "sam")
                    isSam = true;

                progressMessage = "Copying alignment map";
                update();
                await new Promise<void>((resolve,reject) => {
                    if(!isSam)
                        fse.copySync(bamPath,getUnSortedBam(align));
                    else
                        fse.copySync(bamPath,getSam(align));
                    resolve();
                });

                atomic.logString(logger.logRecord,`isSam: ${isSam}  ${"\n"}`);
                if(isSam)
                {
                    progressMessage = "Converting SAM to BAM";
                    update();
                    await samToolsView(align,logger);

                }

                progressMessage = "Sorting BAM";
                update();
                await samToolsSort(align,logger);

                progressMessage = "Getting Flag Statistics";
                update();
                await samToolsFlagStat(align,logger);

                progressMessage = "Generating index";
                update();
                await samToolsIndex(align,logger);

                progressMessage = "Getting mapped reads";
                update();
                await samToolsIdxStats(align,logger);

                flags.done = true
                flags.success = true;
                update();
                process.exit(0);
            })();
        }
    }
);