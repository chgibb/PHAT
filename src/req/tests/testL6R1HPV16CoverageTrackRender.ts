import * as atomic from "./../operations/atomicOperations";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {CompileTemplates} from "./../operations/./CompileTemplates";
import {CircularFigure,getCoverageTrackSVGFromCache} from "./../renderer/circularFigure";
import * as hpv16Figure from "./hpv16Figure";
import * as L6R1HPV16Align from "./L6R1HPV16Align";
export async function  testL6R1HPV16CoverageTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        hpv16Figure.init();
        atomic.addOperation("renderCoverageTrackForContig",{
            circularFigure : hpv16Figure.get(),
            contiguuid : hpv16Figure.get().contigs[0].uuid,
            alignData : L6R1HPV16Align.get()
        });
        atomic.updates.removeAllListeners().on("renderCoverageTrackForContig",function(op : RenderCoverageTrackForContig){
            if(op.flags.success)
            {
                console.log(`Successfully rendered coverage track for ${op.circularFigure.name}`);
                hpv16Figure.set(op.circularFigure);
                return resolve();
                /*atomic.addOperation("compileTemplates",{
                    figure : hpv16Figure.get(),
                    uuid : hpv16Figure.get().renderedCoverageTracks[0].uuid,
                    compileBase : false
                });*/
            }
            else if(op.flags.failure)
            {
                console.log(`Failed to render coverage track for ${op.circularFigure.name}`);
                return reject();
            }
        });/*
        atomic.updates.removeAllListeners().on("compileTemplates",function(op : CompileTemplates){
            if(op.flags.success)
            {
                console.log(`SVG compilation for ${op.uuid} on ${op.figure.name} succeeded`);
                firstSVG = getCoverageTrackSVGFromCache(hpv16Figure.renderedCoverageTracks[0]);
                hpv16Figure.radius = 500;
                atomic.addOperation("compileTemplates",{
                    figure : hpv16Figure,
                    uuid : hpv16Figure.renderedCoverageTracks[0].uuid,
                    compileBase : false
                });
            }
            else if(op.flags.failure)
            {
                console.log(`SVG compilation for ${op.uuid} on ${op.figure.name} failed`);
                return reject();
            }
        });*/ 
    });
}