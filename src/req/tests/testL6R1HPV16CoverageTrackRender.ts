import * as atomic from "./../operations/atomicOperations";
import {RenderCoverageTrackForContig} from "./../operations/RenderCoverageTrack";
import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv16Ref from "./hpv16Ref";
import * as L6R1HPV16Align from "./L6R1HPV16Align";
export async function testL6R1HPV16CoverageTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let hpv16Figure : CircularFigure = new CircularFigure(
            "HPV16 Figure",
            hpv16Ref.get().uuid,
            hpv16Ref.get().contigs
        );
        atomic.addOperation("renderCoverageTrackForContig",{
            circularFigure : hpv16Figure,
            contiguuid : hpv16Figure.contigs[0].uuid,
            alignData : L6R1HPV16Align.get()
        });
        atomic.updates.removeAllListeners().on("renderCoverageTrackForContig",function(op : RenderCoverageTrackForContig){
            if(op.flags.success)
            {
                console.log("Successfully rendered coverage track");
                return resolve();
            }
            else if(op.flags.failure)
            {
                console.log("Failed to render coverage track");
                return reject();
            }
        });
    });
}