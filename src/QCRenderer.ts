import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
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
        
        ipc.on
        (
            'QC',function(event,arg)
            {
                console.log(JSON.stringify(arg,undefined,4));
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            (<summary.SummaryView>viewMgr.getViewByName("summary")).fastqInputs = arg.val;
                            viewMgr.render();
                        }
                    }
                    
                }
                viewMgr.render();
            }
        );
        let validFastQCOut = new RegExp("[0-9]|[.]","g");
        let trimOutFastQCPercentage = new RegExp("[0-9][0-9][%]|[0-9][%]","g");
        ipc.on
        (
            "spawnReply",function(event,arg)
            {
                /*if(arg.processName == QC.fastQC)
                {
                    if(arg.unBufferedData)
                    {
                        if(validFastQCOut.test(arg.unBufferedData))
                        {
                            let regResult = trimOutFastQCPercentage.exec(arg.unBufferedData);
                            if(regResult && regResult[0])
                            {
                                let idx = -1;
                                if(process.platform == "linux")
                                    idx = 0;
                                else if(process.platform == "win32")
                                    idx = 1;
                                $('#'+makeValidID(arg.args[idx])).text(regResult[0]);
                            }
                        }
                    }
                }
                QC.spawnReply("spawnReply",arg);*/
            }
        );
        viewMgr.render();
    }
);
