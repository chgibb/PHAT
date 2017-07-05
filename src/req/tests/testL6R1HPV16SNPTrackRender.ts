import * as atomic from "./../operations/atomicOperations";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv16Ref from "./hpv16Ref";
import * as L6R1HPV16Align from "./L6R1HPV16Align";
export async function testL6R1HPV16SNPTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let hpv16Figure : CircularFigure = new CircularFigure(
            "HPV16 Figure",
            hpv16Ref.get().uuid,
            hpv16Ref.get().contigs
        );
        atomic.addOperation("renderSNPTrackForContig",{
            circularFigure : hpv16Figure,
            contiguuid : hpv16Figure.contigs[0].uuid,
            alignData : L6R1HPV16Align.get()
        });
        atomic.updates.removeAllListeners().on("renderSNPTrackForContig",function(op : RenderSNPTrackForContig){
            if(op.flags.success)
            {
                console.log("Successfully rendered SNP track");
                return resolve();
            }
            else if(op.flags.failure)
            {
                console.log("Failed to render SNP track");
                return reject();
            }
        });
    });
}