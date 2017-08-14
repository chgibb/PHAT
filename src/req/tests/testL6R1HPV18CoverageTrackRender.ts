import * as atomic from "./../operations/atomicOperations";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv18Figure from "./hpv18Figure";
import * as L6R1HPV18Align from "./L6R1HPV18Align";
export async function testL6R1HPV18CoverageTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        hpv18Figure.init();
        atomic.addOperation("renderCoverageTrackForContig",{
            circularFigure : hpv18Figure.get(),
            contiguuid : hpv18Figure.get().contigs[0].uuid,
            alignData : L6R1HPV18Align.get()
        });
        atomic.updates.removeAllListeners().on("renderCoverageTrackForContig",function(op : RenderCoverageTrackForContig){
            if(op.flags.success)
            {
                console.log(`Successfully rendered coverage track for ${op.circularFigure.name}`);
                hpv18Figure.set(op.circularFigure);
                return reject();
            }
            else if(op.flags.failure)
            {
                console.log(`Failed to render coverage track for ${op.circularFigure.name}`);
                return resolve();
            }
        });
    });
}