import * as atomic from "./../operations/atomicOperations";

import {GenerateQCReport} from "./../operations/GenerateQCReport";
import {IndexFasta} from "./../operations/indexFasta";
import {RunAlignment} from "./../operations/RunAlignment";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CheckForUpdate} from "./../operations/CheckForUpdate";
import {DownloadAndInstallUpdate} from "./../operations/DownloadAndInstallUpdate";
import {NewProject} from "./../operations/NewProject";
import {OpenProject} from "./../operations/OpenProject";
import {SaveCurrentProject} from "./../operations//SaveCurrentProject";

export function registerOperations() : void
{
    atomic.register("generateFastQCReport",GenerateQCReport);
    atomic.register("indexFasta",IndexFasta);
    atomic.register("runAlignment",RunAlignment);
    atomic.register("renderCoverageTrackForContig",RenderCoverageTrackForContig);
    atomic.register("renderSNPTrackForContig",RenderSNPTrackForContig);

    atomic.register("checkForUpdate",CheckForUpdate);
    atomic.register("downloadAndInstallUpdate",DownloadAndInstallUpdate);

    atomic.register("newProject",NewProject);
    atomic.register("openProject",OpenProject);
    atomic.register("saveCurrentProject",SaveCurrentProject);
}