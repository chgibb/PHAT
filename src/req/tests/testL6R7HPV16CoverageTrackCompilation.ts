import * as fs from "fs";

import * as atomic from "./../operations/atomicOperations";
import * as cf from "./../renderer/circularFigure";
import * as hpv16Figure from "./hpv16Figure";
export async function testL6R7HPV16CoverageTrackCompilation() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => {

        let figure : cf.CircularFigure = hpv16Figure.get();
        let trackRecord : cf.RenderedCoverageTrackRecord = figure.renderedCoverageTracks[figure.renderedCoverageTracks.length - 1];
        fs.accessSync(cf.getCachedCoverageTrackTemplatePath(trackRecord));
        let map : cf.CoverageTrackMap = await cf.buildCoverageTrackMap(trackRecord,figure);
        fs.accessSync(cf.getCoverageTrackPBPath(trackRecord));
        cf.cacheCoverageTrackSVG(trackRecord,map.renderStart()+map.renderEnd());
        fs.accessSync(cf.getCachedCoverageTrackSVGPath(trackRecord));
        return resolve();
    });
}
