import * as atomic from "./../operations/atomicOperations";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {CircularFigure,getCoverageTrackSVGFromCache} from "./../renderer/circularFigure";
import * as hpv16Figure from "./hpv16Figure";
import * as L6R1HPV16Align from "./L6R1HPV16Align";
export async function  testL6R1HPV16CoverageTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        hpv16Figure.init();
        atomic.addOperation("renderCoverageTrackForContig",{
            circularFigure : hpv16Figure.get(),
            contiguuid : hpv16Figure.get().contigs[0].uuid,
            alignData : L6R1HPV16Align.get()
        });
        atomic.updates.removeAllListeners().on("renderCoverageTrackForContig",async function(op : RenderCoverageTrackForContig)
        {
            if(op.flags.success)
            {
                console.log(`Successfully rendered coverage track for ${op.circularFigure.name}`);
                hpv16Figure.set(op.circularFigure);
                return resolve();
            }
            else if(op.flags.failure)
            {
                console.log(`Failed to render coverage track for ${op.circularFigure.name}`);
                console.log(await atomic.getLogContent(op.logRecord)); 
                return reject();
            }
        });
    });
}