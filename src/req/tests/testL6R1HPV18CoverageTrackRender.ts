import * as atomic from "./../operations/atomicOperations";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv18Ref from "./hpv18Ref";
import * as L6R1HPV18Align from "./L6R1HPV18Align";
export async function testL6R1HPV18CoverageTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let hpv18Figure : CircularFigure = new CircularFigure(
            "HPV18 Figure",
            hpv18Ref.get().uuid,
            hpv18Ref.get().contigs
        );
        atomic.addOperation("renderCoverageTrackForContig",{
            circularFigure : hpv18Figure,
            contiguuid : hpv18Figure.contigs[0].uuid,
            alignData : L6R1HPV18Align.get()
        });
        atomic.updates.removeAllListeners().on("renderCoverageTrackForContig",function(op : RenderCoverageTrackForContig){
            if(op.flags.success)
            {
                console.log(`Successfully rendered coverage track for ${op.circularFigure.name}`);
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