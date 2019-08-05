import * as fs from "fs";

import * as atomic from "./../operations/atomicOperations";
import * as cf from "./../renderer/circularFigure";
import * as hpv16Figure from "./hpv16Figure";
export async function testL6R7HPV16SNPTrackCompilation() : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {

        let figure : cf.CircularFigure = hpv16Figure.get();
        let trackRecord : cf.RenderedSNPTrackRecord = figure.renderedSNPTracks[figure.renderedSNPTracks.length - 1];
        fs.accessSync(cf.getCachedSNPTrackTemplatePath(trackRecord));
        let map : cf.SNPTrackMap = await cf.buildSNPTrackMap(trackRecord,figure);
        cf.cacheSNPTrackSVG(trackRecord,map.renderStart()+map.renderEnd());
        fs.accessSync(cf.getCachedSNPTrackSVGPath(trackRecord));
        return resolve();
    });
}