import * as electron from "electron";
const ipc = electron.ipcRenderer;
import * as viewMgr from "./req/renderer/viewMgr";

import * as pileUpView from "./req/renderer/PathogenRenderer/pileUpView";
import * as reportView from "./req/renderer/PathogenRenderer/reportView";

import Fastq from "./req/renderer/fastq";
import Fasta from "./req/renderer/fasta";

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
            'pathogen',function(event,arg)
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
                            for(var i in arg.val)
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
                            for(var i in arg.val)
                            {
                                if(arg.val[i].checked)
                                {
                                    (<reportView.ReportView>viewMgr.getViewByName("report")).selectedFastqInputs.push(arg.val[i].alias);
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
                replyChannel : "pathogen"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "pathogen"
            }
        );
        ipc.send(
            "getKey",
            {
                action : "getKey",
                channel : "align",
                key : "aligns",
                replyChannel : "pathogen"
            }
        );


        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastqInputs",
                replyChannel : "pathogen"
            }
        );
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "input",
                key : "fastaInputs",
                replyChannel : "pathogen"
            }
        );
        ipc.send(
            "keySub",
            {
                action : "keySub",
                channel : "align",
                key : "aligns",
                replyChannel : "pathogen"
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

