import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import {AlignData} from "./req/alignData"
import * as cf from "./req/renderer/circularFigure";

let align : AlignData;
let contiguuid : string;
let circularFigure : cf.CircularFigure;
let colour : string;

let flags : CompletionFlags = new CompletionFlags();
process.on
(
    "message",function(ev : AtomicOperationForkEvent)
    {
        if(ev.setData == true)
        {
            align = ev.data.alignData;
            contiguuid = ev.data.contiguuid;
            circularFigure = ev.data.circularFigure;
            colour = ev.data.colour;
            process.send(<AtomicOperationForkEvent>{finishedSettingData : true});
            return;
        }

        if(ev.run == true)
        {
            cf.cacheSNPTrack(circularFigure,contiguuid,align,colour).then((SNPTracks : string) => {
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
                process.exit(0);
            });
        }
    }  
);
(process as NodeJS.EventEmitter).on("uncaughtException",function(err : string){
    console.log(err);
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
    process.exit(1);
});

process.on("unhandledRejection",function(err : string){
    console.log(err);
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
    process.exit(1);
});
