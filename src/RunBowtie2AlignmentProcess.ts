import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData,getArtifactDir} from "./req/alignData";
import {getFolderSize} from "./req/getFolderSize";
import formatByteString from "./req/renderer/formatByteString";

import {bowTie2Align} from "./req/operations/RunBowtie2Alignment/bowTie2Align";
import {samToolsDepth} from "./req/operations/RunBowtie2Alignment/samToolsDepth";
import {samToolsIndex} from "./req/operations/RunBowtie2Alignment/samToolsIndex";
import {samToolsSort} from "./req/operations/RunBowtie2Alignment/samToolsSort";
import {samToolsView} from "./req/operations/RunBowtie2Alignment/samToolsView";
import {samToolsFaidx} from "./req/operations/indexFasta/samToolsFaidx";
import {samToolsMPileup} from "./req/operations/RunBowtie2Alignment/samToolsMPileup";
import {samToolsIdxStats} from "./req/operations/RunBowtie2Alignment/samToolsIdxStats";
import {varScanMPileup2SNP} from "./req/operations/RunBowtie2Alignment/varScanMPileup2SNP"

let flags : CompletionFlags = new CompletionFlags();
let align : AlignData;
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
                                                atomic.exitFork(0);

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
