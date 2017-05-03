import * as fs from "fs";
import * as readline from "readline";

import {AtomicOperationForkEvent,CompletionFlags} from "./req/atomicOperationsIPC";
import alignData from "./req/alignData"
import * as cf from "./req/renderer/circularFigure";

let align : alignData;
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
            try
            {
                cf.cacheCoverageTracks(
                    circularFigure,
                    contiguuid,
                    align,
                    function(status,coverageTracks){
                        if(status == true)
                        {
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
                        }
                    },
                    colour
                );
            }
            catch(err)
            {
                flags.done = true;
                flags.failure = true;
                process.send(
                    <AtomicOperationForkEvent>{
                        update : true,
                        flags : flags,
                        data : err
                    }
                );
                process.exit(1);
            }
        }
    }  
);