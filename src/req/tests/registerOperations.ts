import * as atomic from "./../operations/atomicOperations";

import {GenerateQCReport} from "./../operations/GenerateQCReport";
import {IndexFastaForAlignment} from "./../operations/indexFastaForAlignment";
import {IndexFastaForVisualization} from "./../operations/indexFastaForVisualization";
import {RunAlignment} from "./../operations/RunAlignment";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CheckForUpdate} from "./../operations/CheckForUpdate";
import {DownloadAndInstallUpdate} from "./../operations/DownloadAndInstallUpdate";
import {NewProject} from "./../operations/NewProject";
import {OpenProject} from "./../operations/OpenProject";
import {SaveProject} from "./../operations/SaveProject";
import {InputBamFile} from "./../operations/InputBamFile";
import {LinkRefSeqToAlignment} from "./../operations/LinkRefSeqToAlignment";

export function registerOperations() : void
{
    atomic.register("generateFastQCReport",GenerateQCReport);
    atomic.register("indexFastaForAlignment",IndexFastaForAlignment);
    atomic.register("indexFastaForVisualization",IndexFastaForVisualization);
    atomic.register("runAlignment",RunAlignment);
    atomic.register("renderCoverageTrackForContig",RenderCoverageTrackForContig);
    atomic.register("renderSNPTrackForContig",RenderSNPTrackForContig);
    atomic.register("inputBamFile",InputBamFile);
    atomic.register("linkRefSeqToAlignment",LinkRefSeqToAlignment);

    atomic.register("checkForUpdate",CheckForUpdate);
    atomic.register("downloadAndInstallUpdate",DownloadAndInstallUpdate);

    atomic.register("newProject",NewProject);
    atomic.register("openProject",OpenProject);
    atomic.register("saveProject",SaveProject);
}