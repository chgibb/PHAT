import * as atomic from "./../operations/atomicOperations";
import {CompileTemplates} from "./../operations/./CompileTemplates";
import * as cf from "./../renderer/circularFigure";
import * as hpv16Figure from "./hpv16Figure";
export async function testL6R1HPV16CoverageTrackCompilation() : Promise<string>
{
    return new Promise<string>((resolve,reject) => {
        atomic.addOperation("compileTemplates",{
            figure : hpv16Figure.get(),
            uuid : hpv16Figure.get().renderedCoverageTracks[0].uuid,
            compileBase : false
        });
        atomic.updates.removeAllListeners().on("compileTemplates",function(op : CompileTemplates){
            if(op.flags.success)
            {
                console.log(`SVG compilation for ${op.uuid} on ${op.figure.name} succeeded`);
                return resolve(cf.getCoverageTrackSVGFromCache(hpv16Figure.get().renderedCoverageTracks[0]));
            }
            else if(op.flags.failure)
            {
                console.log(`SVG compilation for ${op.uuid} on ${op.figure.name} failed`);
                return reject();
            }
        });
    });
}
