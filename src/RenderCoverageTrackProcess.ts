import * as atomic from "./req/operations/atomicOperations";
import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import {AlignData} from "./req/alignData"
import * as cf from "./req/renderer/circularFigure";
import { buildCoverageTrackMap } from "./req/renderer/circularFigure";

let align : AlignData;
let contiguuid : string;
let circularFigure : cf.CircularFigure;
let colour : string;
let scaleFactor : number;
let log10Scale : boolean;

let flags : CompletionFlags = new CompletionFlags();
process.on
(
    "message",async function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            align = ev.data.alignData;
            contiguuid = ev.data.contiguuid;
            circularFigure = ev.data.circularFigure;
            colour = ev.data.colour;
            scaleFactor = ev.data.scaleFactor;
            log10Scale = ev.data.log10Scale;
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }

        if(ev.run == true)
        {
            await cf.cacheCoverageTrackTemplate(circularFigure,contiguuid,align,colour,scaleFactor,log10Scale);
            let trackRecord : cf.RenderedCoverageTrackRecord = circularFigure.renderedCoverageTracks[circularFigure.renderedCoverageTracks.length - 1];
            let map : cf.CoverageTrackMap = await buildCoverageTrackMap(trackRecord,circularFigure);
            cf.cacheCoverageTrackPB(trackRecord,map);
            flags.done = true;
            flags.success = true;
            process.send(
                <AtomicOperationForkEvent>{
                    update : true,
                    flags : flags,
                    data : {
                        alignData : align,
                        contiguuid : contiguuid,
                        circularFigure : circularFigure,
                        colour : colour
                    }
                }
            );
            atomic.exitFork(0);
        }
    }  
);
(process as NodeJS.EventEmitter).on("uncaughtException",function(err : string){
    flags.done = true;
    flags.failure = true;
    flags.success = false;
    process.send(
        <AtomicOperationForkEvent>{
            update : true,
            flags : flags,
            data : err
        }
    );
    atomic.exitFork(1);
});