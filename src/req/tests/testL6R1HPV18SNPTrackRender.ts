import * as atomic from "./../operations/atomicOperations";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv18Figure from "./hpv18Figure";
import * as L6R1HPV18Align from "./L6R1HPV18Align";
export async function testL6R1HPV18SNPTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        atomic.addOperation("renderSNPTrackForContig",{
            circularFigure : hpv18Figure.get(),
            contiguuid : hpv18Figure.get().contigs[0].uuid,
            alignData : L6R1HPV18Align.get()
        });
        atomic.updates.removeAllListeners().on("renderSNPTrackForContig",function(op : RenderSNPTrackForContig){
            if(op.flags.success)
            {
                console.log(`Successfully rendered SNP track fpr ${op.circularFigure.name}`);
                hpv18Figure.set(op.circularFigure);
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