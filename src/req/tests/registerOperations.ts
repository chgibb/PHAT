import * as atomic from "./../operations/atomicOperations";

import {GenerateQCReport} from "./../operations/GenerateQCReport";
import {IndexFastaForAlignment} from "./../operations/indexFastaForAlignment";
import {IndexFastaForVisualization} from "./../operations/indexFastaForVisualization";
import {RunAlignment} from "./../operations/RunAlignment";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CompileTemplates} from "./../operations/CompileTemplates";
import {CheckForUpdate} from "./../operations/CheckForUpdate";
import {DownloadAndInstallUpdate} from "./../operations/DownloadAndInstallUpdate";
import {NewProject} from "./../operations/NewProject";
import {OpenProject} from "./../operations/OpenProject";
import {SaveCurrentProject} from "./../operations//SaveCurrentProject";

export function registerOperations() : void
{
    atomic.register("generateFastQCReport",GenerateQCReport);
    atomic.register("indexFastaForAlignment",IndexFastaForAlignment);
    atomic.register("indexFastaForVisualization",IndexFastaForVisualization);
    atomic.register("runAlignment",RunAlignment);
    atomic.register("renderCoverageTrackForContig",RenderCoverageTrackForContig);
    atomic.register("renderSNPTrackForContig",RenderSNPTrackForContig);
    atomic.register("compileTemplates",CompileTemplates);

    atomic.register("checkForUpdate",CheckForUpdate);
    atomic.register("downloadAndInstallUpdate",DownloadAndInstallUpdate);

    atomic.register("newProject",NewProject);
    atomic.register("openProject",OpenProject);
    atomic.register("saveCurrentProject",SaveCurrentProject);
}