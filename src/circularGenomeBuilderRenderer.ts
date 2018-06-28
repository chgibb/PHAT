import {ipcRenderer} from "electron";
let ipc = ipcRenderer;
import * as viewMgr from "./req/renderer/viewMgr";
import * as masterView from "./req/renderer/circularGenomeBuilderRenderer/masterView";
import * as genomeView from "./req/renderer/circularGenomeBuilderRenderer/genomeView";
import {CircularFigure,} from "./req/renderer/circularFigure";
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";
import {makeWindowDockable} from "./req/renderer/dock";
import {showGenericLoadingSpinnerInNavBar,hideSpinnerInNavBar} from "./req/renderer/circularGenomeBuilderRenderer/loadingSpinner";
import * as tc from "./req/renderer/circularGenomeBuilderRenderer/templateCache";
import "./req/renderer/commonBehaviour";
import {AtomicOperation} from "./req/operations/atomicOperations";

const $ = require("jquery");
(<any>window).$ = $;
$
(
    function()
    {
        makeWindowDockable("circularGenomeBuilder");
        masterView.addView(viewMgr.views,"view");
        viewMgr.changeView("masterView");
        viewMgr.render();
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "input",
                key : "fastaInputs",
                replyChannel : "circularGenomeBuilder",
                action : "getKey"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "circularGenomeBuilder",
                key : "circularFigures",
                replyChannel : "circularGenomeBuilder",
                action : "getKey"
            }
        );
        ipc.send(
            "getKey",
            <GetKeyEvent>{
                channel : "align",
                key : "aligns",
                replyChannel : "circularGenomeBuilder",
                action : "getKey"
            }
        );

        ipc.send(
            "keySub",
            <KeySubEvent>{
                channel : "input",
                key : "fastaInputs",
                replyChannel : "circularGenomeBuilder",
                action : "keySub"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                channel : "circularGenomeBuilder",
                key : "circularFigures",
                replyChannel : "circularGenomeBuilder",
                action : "keySub"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                channel : "align",
                key : "aligns",
                replyChannel : "circularGenomeBuilder",
                action : "keySub"
            }
        );
        ipc.send(
            "keySub",
            <KeySubEvent>{
                channel : "application",
                key : "operations",
                replyChannel : "circularGenomeBuilder",
                action : "keySub"
            }
        );
        ipc.on
        (
            'circularGenomeBuilder',async function(event : Electron.IpcMessageEvent,arg : any)
            {
                let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            masterView.fastaInputs = arg.val;
                        }
                    }
                    if(arg.key == "aligns")
                    {
                        if(arg.val !== undefined)
                        {
                            masterView.alignData = arg.val;
                        }
                    }
                    if(arg.key == "circularFigures")
                    {
                        if(arg.val !== undefined)
                        {
                            let currentFigure = "";

                            //If there's currently a figure being edited then save its id
                            if(genomeView.genome)
                                currentFigure = genomeView.genome.uuid;
                            //overwrite our figure cache with the updated one
                            masterView.circularFigures = arg.val;
                            //reassign our current figure with the (potentially changed) new one
                            if(currentFigure)
                            {
                                let found = false;
                                for(let i : number = 0; i != masterView.circularFigures.length; ++i)
                                {
                                    if(masterView.circularFigures[i].uuid == currentFigure)
                                    {
                                        found = true;
                                        genomeView.genome = masterView.circularFigures[i];
                                        genomeView.firstRender = true;
                                        break;
                                    }
                                }
                                if(!found)
                                {
                                    genomeView.genome = undefined;
                                    genomeView.firstRender = true;
                                }
                            }
                            
                        }
                    }
                    let found = false;
                    if(arg.key == "operations")
                    {
                        if(arg.val !== undefined)
                        {
                            let ops : Array<AtomicOperation> = arg.val;
                            try
                            {
                                for(let i = 0; i != ops.length; ++i)
                                {
                                    if(ops[i].name == "renderCoverageTrackForContig" || ops[i].name == "renderSNPTrackForContig" || ops[i].name == "BLASTSegment")
                                    {
                                        genomeView.shouldAllowTriggeringOps = false;
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            catch(err){}
                        }
                    }
                    if(!found)
                        genomeView.shouldAllowTriggeringOps = true;
                }
                viewMgr.render();
            }
        );
    }
);
$(window).resize
(
	function()
	{
        viewMgr.render();
    }
);
window.addEventListener("beforeunload",function(){
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    masterView.dataChanged();
});
