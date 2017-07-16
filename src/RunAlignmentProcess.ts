import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {alignData,getArtifactDir} from "./req/alignData";
import {getFolderSize} from "./req/getFolderSize";
import formatByteString from "./req/renderer/formatByteString";

import {bowTie2Align} from "./req/operations/RunAlignment/bowTie2Align";
import {samToolsDepth} from "./req/operations/RunAlignment/samToolsDepth";
import {samToolsIndex} from "./req/operations/RunAlignment/samToolsIndex";
import {samToolsSort} from "./req/operations/RunAlignment/samToolsSort";
import {samToolsView} from "./req/operations/RunAlignment/samToolsView";
import {samToolsFaidx} from "./req/operations/indexFasta/samToolsFaidx";
import {samToolsMPileup} from "./req/operations/RunAlignment/samToolsMPileup";
import {samToolsIdxStats} from "./req/operations/RunAlignment/samToolsIdxStats";
import {varScanMPileup2SNP} from "./req/operations/RunAlignment/varScanMPileup2SNP"

let flags : CompletionFlags = new CompletionFlags();
let align : alignData;
let step = 1;
let progressMessage = "Aligning";

let logger : atomic.ForkLogger = new atomic.ForkLogger();
atomic.handleForkFailures(logger);

function update() : void
{
    let update = <AtomicOperationForkEvent>{
        update : true,
        flags : flags,
        step : step,
        progressMessage : progressMessage,
        data : {
            alignData : align
        }
    };
    if(flags.done)
    {
        if(flags.success)
            update.logRecord = atomic.closeLog(logger.logKey,"success");
        else if(flags.failure)
            update.logRecord = atomic.closeLog(logger.logKey,"failure");
    }
    logger.logObject(update);
    process.send(update);
}


process.on(
    "message",function(ev : AtomicOperationForkEvent){
        if(ev.setData == true)
        {
            logger.logKey = atomic.openLog(ev.name,ev.description);
            align = ev.data.alignData;
            process.send(<AtomicOperationForkEvent>{
                finishedSettingData : true
            });
        }
        if(ev.run == true)
        {
            update();
            bowTie2Align(align,logger).then((result) => {

                progressMessage = "Converting SAM to BAM";
                step++;
                update();

                samToolsView(align,logger).then((result) => {

                    progressMessage = "Sorting BAM";
                    step++;
                    update();

                    samToolsSort(align,logger).then((result) => {

                        progressMessage = "Indexing BAM";
                        step++;
                        update();

                        samToolsIndex(align,logger).then((result) => {

                            progressMessage = "Getting read depth";
                            step++;
                            update();

                            samToolsDepth(align,logger).then((result) => {

                                progressMessage = "Creating temporary reference index";
                                step++;
                                update();

                                samToolsFaidx(align.fasta,logger).then((result) => {

                                    progressMessage = "Generating pileup";
                                    step++;
                                    update();

                                    samToolsMPileup(align,logger).then((result) => {

                                        progressMessage = "Predicting SNPs and indels";
                                        step++;
                                        update();

                                        varScanMPileup2SNP(align,logger).then((result) => {

                                            progressMessage = "Getting mapped reads";
                                            step++;
                                            update();

                                            samToolsIdxStats(align,logger).then((result) => {

                                                step++;
                                                align.size = getFolderSize(getArtifactDir(align));
                                                align.sizeString = formatByteString(align.size);
                                                flags.done = true;
                                                flags.success = true;
                                                update();
                                                process.exit(0);

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }
);
