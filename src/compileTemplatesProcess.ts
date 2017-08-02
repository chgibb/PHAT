import * as fs from "fs";

const ngcompile = require('@chgibb/ng-node-compile');

import * as atomic from "./req/operations/atomicOperations";
import {AtomicOperationForkEvent} from "./req/atomicOperationsIPC";
import * as cf from "./req/renderer/circularFigure";
let envReady = false;
let flags : atomic.CompletionFlags = new atomic.CompletionFlags();
let templates : string;
let figure : cf.CircularFigure;
let logger : atomic.ForkLogger = new atomic.ForkLogger();
atomic.handleForkFailures(logger);

function compileAndSend(templates : string,figure : cf.CircularFigure)
{
    if(!ngcompile.prototype.envReady)
    {
        setTimeout(function(){
            compileAndSend(templates,figure);
        },200);
        console.log("env not ready");
        return;
    }
    let ngEnvironment = new ngcompile([{name : "app", path : "angularplasmid"}]);
    templates = ngEnvironment.$compile(templates)({genome : figure});
    flags.done = true;
    flags.success = true;
    flags.failure = false;
    let logRecord : atomic.LogRecord;
    logRecord = atomic.closeLog(logger.logKey,"success");
    process.send(<AtomicOperationForkEvent>{
        update : true,
        flags : flags,
        logRecord : logRecord,
        data : {
            templates : templates,
            figure : figure
        }
    });
    process.exit(0);
}

process.on(
    "message",function(ev : AtomicOperationForkEvent){
        if(ev.setData == true)
        {
            logger.logKey = atomic.openLog(ev.name,ev.description);
            compileAndSend(ev.data.templates,ev.data.figure);
        }
    }  
);
