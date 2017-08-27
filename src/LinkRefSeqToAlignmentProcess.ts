import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import * as atomic from "./req/operations/atomicOperations";
import {AlignData} from "./req/alignData";
import {Fasta} from "./req/fasta";

import {getLinkableRefSeqs} from "./req/getLinkableRefSeqs";
import {samToolsDepth} from "./req/operations/RunAlignment/samToolsDepth";
import {samToolsFaidx} from "./req/operations/indexFasta/samToolsFaidx";
import {samToolsMPileup} from "./req/operations/RunAlignment/samToolsMPileup";
import {varScanMPileup2SNP} from "./req/operations/RunAlignment/varScanMPileup2SNP"

let flags : CompletionFlags = new CompletionFlags();
let align : AlignData;
let fasta : Fasta;

let progressMessage = "";

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
            align = ev.data.align;
            fasta = ev.data.fasta;
            process.send(<AtomicOperationForkEvent>{
                finishedSettingData : true
            });
        }
        if(ev.run == true)
        {
            (async function(){
                let linkableRefSeqs = getLinkableRefSeqs(<Array<Fasta>>[fasta],align);
                for(let i = 0; i != linkableRefSeqs.length; ++i)
                {
                    if(linkableRefSeqs[i].linkable && linkableRefSeqs[i].uuid == fasta.uuid)
                    {
                        atomic.logString(logger.logRecord,"Ref and alignment are linkable");
                        align.fasta = fasta;
                        break;
                    }
                    else
                    {
                        throw new Error("Ref and alignment are not linkable");
                    }
                }
                progressMessage = "Getting read depth";
                update();
                await samToolsDepth(align,logger);

                progressMessage = "Creating temporary reference index";
                update();
                await samToolsFaidx(align.fasta,logger);

                progressMessage = "Generating pileup";
                update();
                await samToolsMPileup(align,logger);

                progressMessage = "Predicting SNPs and indels";
                update();
                await varScanMPileup2SNP(align,logger);

                flags.done = true;
                flags.success = true;
                update();

                process.exit(0);
            })();
        }
    }
);