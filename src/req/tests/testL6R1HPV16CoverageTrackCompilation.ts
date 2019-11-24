import * as fs from "fs";

import * as cf from "../renderer/circularFigure/circularFigure";

import * as hpv16Figure from "./hpv16Figure";
export async function testL6R1HPV16CoverageTrackCompilation() : Promise<void>
{
    return new Promise<void>(async (resolve) => 
    {

        let figure : cf.CircularFigure = hpv16Figure.get();
        let trackRecord : cf.CoverageTrackLayer = figure.renderedCoverageTracks[figure.renderedCoverageTracks.length - 1];
        fs.accessSync(cf.getCachedCoverageTrackTemplatePath(trackRecord));
        let map : cf.CoverageTrackMap = await cf.buildCoverageTrackMap(trackRecord,figure);
        fs.accessSync(cf.getCoverageTrackPBPath(trackRecord));
        cf.cacheCoverageTrackSVG(trackRecord,map.renderStart()+map.renderEnd());
        fs.accessSync(cf.getCachedCoverageTrackSVGPath(trackRecord));
        return resolve();
    });
}
