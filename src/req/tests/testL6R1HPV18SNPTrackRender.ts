import * as atomic from "./../operations/atomicOperations";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv18Ref from "./hpv18Ref";
import * as L6R1HPV18Align from "./L6R1HPV18Align";
export async function testL6R1HPV18SNPTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let hpv18Figure : CircularFigure = new CircularFigure(
            "HPV18 Figure",
            hpv18Ref.get().uuid,
            hpv18Ref.get().contigs
        );
        atomic.addOperation("renderSNPTrackForContig",{
            circularFigure : hpv18Figure,
            contiguuid : hpv18Figure.contigs[0].uuid,
            alignData : L6R1HPV18Align.get()
        });
        atomic.updates.removeAllListeners().on("renderSNPTrackForContig",function(op : RenderSNPTrackForContig){
            if(op.flags.success)
            {
                console.log(`Successfully rendered SNP track fpr ${op.circularFigure.name}`);
                return resolve();
            }
            else if(op.flags.failure)
            {
                console.log(`Failed to render SNP track for ${op.circularFigure.name}`);
                return reject();
            }
        });
    });
}