import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import  {AtomicOperation} from "./req/operations/atomicOperations"
import  {GenerateQCReport} from "./req/operations/GenerateQCReport"
import * as viewMgr from "./req/renderer/viewMgr";

import * as summary from "./req/renderer/QCRenderer/summaryView";
import * as report from "./req/renderer/QCRenderer/reportView";

require("./req/renderer/commonBehaviour");

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");

$
(
    function()
    {
        summary.addView(viewMgr.views,'reports');
        report.addView(viewMgr.views,'reports');


        viewMgr.changeView("summary");

        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "QC"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                action : "getKey",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "QC"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                action : "keySub",
                channel : "application",
                key : "operations",
                replyChannel : "QC"
            }
        );
        let validFastQCOut = new RegExp("[0-9]|[.]","g");
        let trimOutFastQCPercentage = new RegExp("[0-9][0-9][%]|[0-9][%]","g");
        ipc.on
        (
            'QC',function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        //Update fastq list and rerender
                        if(arg.val !== undefined)
                        {
                            (<summary.SummaryView>viewMgr.getViewByName("summary")).fastqInputs = arg.val;
                            viewMgr.render();
                        }
                    }
                    if(arg.key == "operations")
                    {
                        //On update from running jobs
                        let operations : Array<AtomicOperation> = arg.val;
                        for(let i : number = 0; i != operations.length; ++i)
                        {
                            //look for only report generation jobs
                            if(operations[i].name == "generateFastQCReport")
                            {
                                let op : GenerateQCReport = (<any>operations[i]);
                                //notify user on failure
                                /*if(op.flags.failure)
                                {
                                    alert(`Failed to generate report for ${op.fastq.alias}`);
                                    if(op.hasJVMCrashed)
                                    {
                                        alert(`Java Virtual Machine has crashed`);
                                    }
                                    viewMgr.render();
                                }*/
                                //Check for stdout from FastQC
                                if(op.spawnUpdate && op.spawnUpdate.unBufferedData)
                                {
                                    //if its not garbled
                                    if(validFastQCOut.test(op.spawnUpdate.unBufferedData))
                                    {
                                        //extract percentage
                                        let regResult = trimOutFastQCPercentage.exec(op.spawnUpdate.unBufferedData);
                                        if(regResult && regResult[0])
                                        {
                                            //find the fastq in the table corresponding to the one being processed and
                                            //put the percentage next to it
                                            let fastqInputs = (<summary.SummaryView>viewMgr.getViewByName("summary")).fastqInputs;
                                            for(let i : number = 0; i != fastqInputs.length; ++i)
                                            {
                                                if(fastqInputs[i].uuid == op.fastq.uuid)
                                                {
                                                    $(`#${op.fastq.uuid}`).text(regResult[0]);
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                    return;
                                }
                            }
                        }
                    }
                }
                viewMgr.render();
            }
        );
        viewMgr.render();
    }
);
