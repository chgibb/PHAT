import * as fs from "fs";

const ngcompile = require('@chgibb/ng-node-compile');

import * as atomic from "./req/operations/atomicOperations";
import {AtomicOperationForkEvent} from "./req/atomicOperationsIPC";
import * as cf from "./req/renderer/circularFigure";
let envReady = false;
let flags : atomic.CompletionFlags = new atomic.CompletionFlags();
let figure : cf.CircularFigure;
let uuid : string;
let compileBase : boolean;
let logger : atomic.ForkLogger = new atomic.ForkLogger();

atomic.handleForkFailures(logger);

function compileAndSend()
{
    if(!ngcompile.prototype.envReady)
    {
        setTimeout(function(){
            compileAndSend();
        },200);
        atomic.logString(logger.logRecord,"Environment not ready");
        return;
    }
    atomic.logString(logger.logRecord,"Environment ready");
    logger.logObject(figure);
    let ngEnvironment = new ngcompile([{name : "app", path : "angularplasmid"}]);
        
    if(!compileBase)
    {
        for(let i = 0; i != figure.renderedCoverageTracks.length; ++i)
        {
            if(uuid == figure.renderedCoverageTracks[i].uuid)
            {
                cf.cachCoverageTrackSVG(
                    figure.renderedCoverageTracks[i],
                    ngEnvironment.$compile(
                        cf.assembleCompilableCoverageTrack(figure,figure.renderedCoverageTracks[i])
                    )({genome : figure})
                );
                break;
            }
        }

        for(let i = 0; i != figure.renderedSNPTracks.length; ++i)
        {
            if(uuid == figure.renderedSNPTracks[i].uuid)
            {
                cf.cacheSNPTrackSVG(
                    figure.renderedSNPTracks[i],
                    ngEnvironment.$compile(
                        cf.assembleCompilableSNPTrack(figure,figure.renderedSNPTracks[i])
                    )({genome : figure})
                );
                break;
            }
        }
    }
    else if(compileBase)
    {
        cf.cacheBaseFigureSVG(
            figure,
            ngEnvironment.$compile(
                cf.assembleCompilableBaseFigureTemplates(figure)
            )({genome : figure})
        );
    }


    flags.done = true;
    flags.success = true;
    flags.failure = false;
    atomic.closeLog(logger.logRecord,"success");
    process.send(<AtomicOperationForkEvent>{
        update : true,
        flags : flags,
        logRecord : logger.logRecord,
        data : {
            figure : figure
        }
    });
    process.exit(0);
}

process.on(
    "message",function(ev : AtomicOperationForkEvent){
        if(ev.setData == true)
        {
            logger.logRecord = atomic.openLog(ev.name,ev.description);
            figure = ev.data.figure;
            uuid = ev.data.uuid;
            compileBase = ev.data.compileBase;
            logger.logObject(ev);
            logger.logObject(ev);
            logger.logObject(ev);
            compileAndSend();
        }
    }  
);
