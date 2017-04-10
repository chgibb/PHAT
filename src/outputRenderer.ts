import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import Fastq from "./req/renderer/fastq";
import {QCData} from "./req/renderer/QCData";
import * as viewMgr from "./req/renderer/viewMgr";

import * as masterView from "./req/renderer/OutputRenderer/masterView";
import * as reportView from "./req/renderer/OutputRenderer/reportView";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");
$
(
    function()
    {
        masterView.addView(viewMgr.views,"view");
        viewMgr.changeView("masterReportView");


        viewMgr.render();
        ipc.on
        (
            "output",function(event,arg)
            {
                if(arg.action === "getKey" || arg.action === "keyChange")
                {
                    if(arg.key == "fastqInputs" && arg.val !== undefined)
                        (<reportView.ReportView>viewMgr.getViewByName("report",(<masterView.MasterView>viewMgr.getViewByName("masterReportView")).views)).fastqInputs = arg.val;
                    if(arg.key == "QCData" && arg.val !== undefined)
                        (<reportView.ReportView>viewMgr.getViewByName("report",(<masterView.MasterView>viewMgr.getViewByName("masterReportView")).views)).QC.QCData = arg.val;
                }
                viewMgr.render();
            }
        );

        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            }
        );
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "QC",
                key : "QCData",
                replyChannel : "output"
            }
        );


        ipc.send(
            "getKey",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "output"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "keySub",
                channel : "QC",
                key : "QCData",
                replyChannel : "output"
            }
        );
    }
);