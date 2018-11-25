import * as atomic from "./../operations/atomicOperations";

import {GenerateQCReport} from "./../operations/GenerateQCReport";
import {IndexFastaForBowtie2Alignment} from "../operations/indexFastaForBowtie2Alignment";
import {IndexFastaForHisat2Alignment} from "../operations/indexFastaForHisat2Alignment";
import {IndexFastaForVisualization} from "./../operations/indexFastaForVisualization";
import {RunBowtie2Alignment} from "../operations/RunBowtie2Alignment";
import {RunHisat2Alignment} from "../operations/RunHisat2Alignment";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CheckForUpdate} from "./../operations/CheckForUpdate";
import {DownloadAndInstallUpdate} from "./../operations/DownloadAndInstallUpdate";
import {NewProject} from "./../operations/NewProject";
import {OpenProject} from "./../operations/OpenProject";
import {SaveProject} from "./../operations/SaveProject";
import {InputBamFile} from "./../operations/InputBamFile";
import {LinkRefSeqToAlignment} from "./../operations/LinkRefSeqToAlignment";
import {BLASTSegment} from "./../operations//BLASTSegment";

export function registerOperations() : void
{
    atomic.register("generateFastQCReport",GenerateQCReport);
    atomic.register("indexFastaForHisat2Alignment",IndexFastaForHisat2Alignment);
    atomic.register("indexFastaForBowtie2Alignment",IndexFastaForBowtie2Alignment);
    atomic.register("indexFastaForVisualization",IndexFastaForVisualization);
    atomic.register("runBowtie2Alignment",RunBowtie2Alignment);
    atomic.register("runHisat2Alignment",RunHisat2Alignment);
    atomic.register("renderCoverageTrackForContig",RenderCoverageTrackForContig);
    atomic.register("renderSNPTrackForContig",RenderSNPTrackForContig);
    atomic.register("inputBamFile",InputBamFile);
    atomic.register("linkRefSeqToAlignment",LinkRefSeqToAlignment);
    atomic.register("BLASTSegment",BLASTSegment);

    atomic.register("checkForUpdate",CheckForUpdate);
    atomic.register("downloadAndInstallUpdate",DownloadAndInstallUpdate);

    atomic.register("newProject",NewProject);
    atomic.register("openProject",OpenProject);
    atomic.register("saveProject",SaveProject);
}