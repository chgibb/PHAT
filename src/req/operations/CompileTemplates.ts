import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import * as cf from "./../renderer/circularFigure";
import {getReadable} from "./../getAppPath";
export class CompileTemplates extends atomic.AtomicOperation
{
    public figure : cf.CircularFigure;
    public uuid : string;
    public compileBase : boolean;
    public compileTemplatesProcess : cp.ChildProcess;
    public constructor()
    {
        super();
        this.closeLogOnFailure = false;
        this.closeLogOnSuccess = false;
    }
    public setData(data : {
        figure : cf.CircularFigure,
        uuid : string,
        compileBase : boolean
    }) : void
    {
        this.figure = data.figure;
        this.uuid = data.uuid;
        this.compileBase = data.compileBase;
        
    }
    public run() : void
    {
        let self = this;
        this.compileTemplatesProcess = cp.fork(getReadable("compileTemplates.js"));

        self.compileTemplatesProcess.on(
            "message",function(ev : AtomicOperationForkEvent){
                if(ev.update == true)
                {
                    self.flags = ev.flags;
                    if(ev.flags.done)
                    {
                        self.logRecord = ev.logRecord;
                        atomic.recordLogRecord(ev.logRecord);
                    }
                    if(ev.flags.success)
                    {
                        self.figure = ev.data.figure;
                    }
                    self.update();
                }
            }
        );

        setTimeout(
            function(){
                self.compileTemplatesProcess.send(
                    <AtomicOperationForkEvent>{
                        setData : true,
                        data : {
                            figure : self.figure,
                            uuid : self.uuid,
                            compileBase : self.compileBase
                        },
                        name : self.name,
                        description : "Compile Templates For Figure"
                    }
                );
            },10
        );
    }
}