import * as cp from "child_process";

import * as atomic from "./atomicOperations";
import {AtomicOperationForkEvent} from "./../atomicOperationsIPC";
import * as cf from "./../renderer/circularFigure";
import {getReadable} from "./../getAppPath";
export class CompileTemplates extends atomic.AtomicOperation
{
    public templates : string;
    public figure : cf.CircularFigure;
    public compileTemplatesProcess : cp.ChildProcess;
    public constructor()
    {
        super();
    }
    public setData(data : {
        templates : string,
        figure : cf.CircularFigure
    }) : void
    {
        this.templates = data.templates;
        this.figure = data.figure;
        console.log("templates recieved in operation");
        console.log(this.templates);
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
                        atomic.recordLogRecord(ev.logRecord);
                    }
                    if(ev.flags.success)
                    {
                        self.templates = ev.data.templates;
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
                            templates : self.templates,
                            figure : self.figure
                        },
                        name : self.name,
                        description : "Compile Templates For Figure"
                    }
                );
            },10
        );
    }
}