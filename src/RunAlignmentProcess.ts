import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
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


function update() : void
{
    process.send(<AtomicOperationForkEvent>{
        update : true,
        flags : flags,
        data : {
            step : step,
            progressMessage : progressMessage,
            alignData : align
        }
    });
}


process.on(
    "message",function(ev : AtomicOperationForkEvent){
        if(ev.setData == true)
        {
            align = ev.data.alignData;
            process.send(<AtomicOperationForkEvent>{
                finishedSettingData : true
            });
        }
        if(ev.run == true)
        {
            update();
            bowTie2Align(align,()=>{}).then((result) => {

                progressMessage = "Converting SAM to BAM";
                step++;
                update();

                samToolsView(align).then((result) => {

                    progressMessage = "Sorting BAM";
                    step++;
                    update();

                    samToolsSort(align).then((result) => {

                        progressMessage = "Indexing BAM";
                        step++;
                        update();

                        samToolsIndex(align).then((result) => {

                            progressMessage = "Getting read depth";
                            step++;
                            update();

                            samToolsDepth(align).then((result) => {

                                progressMessage = "Creating temporary reference index";
                                step++;
                                update();

                                samToolsFaidx(align.fasta).then((result) => {

                                    progressMessage = "Generating pileup";
                                    step++;
                                    update();

                                    samToolsMPileup(align).then((result) => {

                                        progressMessage = "Predicting SNPs and indels";
                                        step++;
                                        update();

                                        varScanMPileup2SNP(align).then((result) => {

                                            progressMessage = "Getting mapped reads";
                                            step++;
                                            update();

                                            samToolsIdxStats(align).then((result) => {

                                                step++;
                                                align.size = getFolderSize(getArtifactDir(align));
                                                align.sizeString = formatByteString(align.size);
                                                flags.done = true;
                                                flags.success = true;
                                                update();

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

process.on("uncaughtException",function(err : string){
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err,
            progressMessage : progressMessage
        }
    );
    process.exit(1);
});

process.on("unhandledRejection",function(err : string){
    console.log("ERROR "+err);
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err,
            progressMessage : progressMessage
        }
    );
    process.exit(1);
});
