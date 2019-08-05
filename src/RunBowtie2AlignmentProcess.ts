import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData,getArtifactDir} from "./req/alignData";
import {getFolderSize} from "./req/getFolderSize";
import formatByteString from "./req/renderer/formatByteString";
import {bowtie2Align} from "./req/operations/RunAlignment/bowtie2Align";
import {samToolsDepth} from "./req/operations/RunAlignment/samToolsDepth";
import {samToolsIndex} from "./req/operations/RunAlignment/samToolsIndex";
import {samToolsSort} from "./req/operations/RunAlignment/samToolsSort";
import {samToolsView} from "./req/operations/RunAlignment/samToolsView";
import {samToolsFaidx} from "./req/operations/indexFasta/samToolsFaidx";
import {samToolsMPileup} from "./req/operations/RunAlignment/samToolsMPileup";
import {samToolsIdxStats} from "./req/operations/RunAlignment/samToolsIdxStats";
import {varScanMPileup2SNP} from "./req/operations/RunAlignment/varScanMPileup2SNP";
import {parseBowtie2AlignmentReport} from "./req/bowTie2AlignmentReportParser";

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
    "message",async function(ev : AtomicOperationForkEvent)
    {
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

            await bowtie2Align(align,logger);
            align.summary = parseBowtie2AlignmentReport(align.summaryText);

            progressMessage = "Converting SAM to BAM";
            step++;
            update();
            await samToolsView(align,logger);

            progressMessage = "Sorting BAM";
            step++;
            update();
            await samToolsSort(align,logger);

            progressMessage = "Indexing BAM";
            step++;
            update();
            await samToolsIndex(align,logger);

            progressMessage = "Getting read depth";
            step++;
            update();
            await samToolsDepth(align,logger);

            progressMessage = "Creating temporary reference index";
            step++;
            update();
            await samToolsFaidx(align.fasta,logger);

            progressMessage = "Generating pileup";
            step++;
            update();
            await samToolsMPileup(align,logger);

            progressMessage = "Predicting SNPs and indels";
            step++;
            update();
            await varScanMPileup2SNP(align,logger);

            progressMessage = "Getting mapped reads";
            step++;
            update();
            await samToolsIdxStats(align,logger);

            step++;
            align.size = getFolderSize(getArtifactDir(align));
            align.sizeString = formatByteString(align.size);
            flags.done = true;
            flags.success = true;
            update();
            atomic.exitFork(0);
        }
    }
);
