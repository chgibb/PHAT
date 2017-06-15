import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as viewMgr from "./req/renderer/viewMgr";

import * as pileUpView from "./req/renderer/PileupRenderer/pileUpView";
import * as reportView from "./req/renderer/PileupRenderer/reportView";

import Fastq from "./req/fastq";
import {Fasta} from "./req/fasta";

import * as $ from "jquery";
(<any>window).$ = $;
require("./req/renderer/commonBehaviour");
$
(
    function()
    {
        pileUpView.addView(viewMgr.views,"view");
        reportView.addView(viewMgr.views,"view");


        viewMgr.changeView("report");



        ipc.on
        (
            'pileup',function(event,arg)
            {
                if(arg.action === "getKey" || arg.action === "keyChange")
                {
                    if(arg.key == 'aligns')
                    {
                        if(arg.val !== undefined)
                        {
                            (<pileUpView.PileUpView>viewMgr.getViewByName("pileUp")).aligns = arg.val;
                            (<reportView.ReportView>viewMgr.getViewByName("report")).aligns = arg.val;
                        }
                        viewMgr.render();
                    }
                    if(arg.key == 'fastaInputs')
                    {
                        if(arg.val !== undefined)
                        {
                            (<pileUpView.PileUpView>viewMgr.getViewByName("pileUp")).selectedFastaInputs = new Array<Fasta>();
                            (<reportView.ReportView>viewMgr.getViewByName("report")).selectedFastaInputs = new Array<Fasta>();
                            for(let i : number = 0; i != arg.val.length; ++i)
                            {
                                if(arg.val[i].checked)
                                {
                                    (<pileUpView.PileUpView>viewMgr.getViewByName("pileUp")).selectedFastaInputs.push(arg.val[i]);
                                    (<reportView.ReportView>viewMgr.getViewByName("report")).selectedFastaInputs.push(arg.val[i]);
                                }
                            }
                            viewMgr.render();
                        }
                    }
                    if(arg.key == 'fastqInputs')
                    {
                        if(arg.val !== undefined)
                        {
                            (<reportView.ReportView>viewMgr.getViewByName("report")).selectedFastqInputs = new Array<Fastq>();
                            for(let i : number = 0; i != arg.val.length; ++i)
                            {
                                if(arg.val[i].checked)
                                {
                                    (<reportView.ReportView>viewMgr.getViewByName("report")).selectedFastqInputs.push(arg.val[i]);
                                }
                            }
                            viewMgr.render();
                        }
                    }
                    viewMgr.render();
                }
            }
        );

        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "pileup"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "pileup"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "align",
                key : "aligns",
                replyChannel : "pileup"
            }
        );


        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "pileup"
            }
        );
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "pileup"
            }
        );
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "align",
                key : "aligns",
                replyChannel : "pileup"
            }
        );

        
        viewMgr.render();
    }
);
$(window).resize
(
	function()
	{
        document.getElementById("view").style.height = $(window).height()+"px";
    }
);

