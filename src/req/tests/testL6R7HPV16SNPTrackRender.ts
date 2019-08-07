import * as atomic from "./../operations/atomicOperations";
import {RenderSNPTrackForContig} from "./../operations/RenderSNPTrack";
import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv16Figure from "./hpv16Figure";
import * as L6R7HPV16Align from "./L6R7HPV16Align";
export async function testL6R7HPV16SNPTrackRenderer() : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        atomic.addOperation("renderSNPTrackForContig",{
            circularFigure : hpv16Figure.get(),
            contiguuid : hpv16Figure.get().contigs[0].uuid,
            alignData : L6R7HPV16Align.get()
        });
        atomic.updates.removeAllListeners().on("renderSNPTrackForContig",async function(op : RenderSNPTrackForContig)
        {
            if(op.flags.success)
            {
                console.log(`Successfully rendered SNP track for ${op.circularFigure!.name}`);
                hpv16Figure.set(op.circularFigure!);
                return resolve();
            }
            else if(op.flags.failure)
            {
                console.log(`Failed to render SNP track for ${op.circularFigure!.name}`);
                console.log(await atomic.getLogContent(op.logRecord!)); 
                return reject();
            }
        });
    });
}