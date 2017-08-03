import {ipcRenderer} from "electron";
let ipc = ipcRenderer;
import * as viewMgr from "./req/renderer/viewMgr";
import * as masterView from "./req/renderer/circularGenomeBuilderRenderer/masterView";
import * as genomeView from "./req/renderer/circularGenomeBuilderRenderer/genomeView";
import {CircularFigure,} from "./req/renderer/circularFigure";
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

import * as svgCache from "./req/renderer/circularGenomeBuilderRenderer/SVGCache";
import {CompileTemplates} from "./req/operations/CompileTemplates";

require("./req/renderer/commonBehaviour");

import * as $ from "jquery";
(<any>window).$ = $;
$
(
    function()
    {
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
            'circularGenomeBuilder',function(event : Electron.IpcMessageEvent,arg : any)
            {
                console.log(arg);
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                            masterView.fastaInputs = arg.val;
                        }
                    }
                    if(arg.key == "aligns")
                    {
                        if(arg.val !== undefined)
                        {
                            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                            masterView.alignData = arg.val;
                        }
                    }
                    if(arg.key == "circularFigures")
                    {
                        if(arg.val !== undefined)
                        {
                            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                            let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
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
                    if(arg.key == "operations")
                    {
                        if(arg.val !== undefined)
                        {
                            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                            let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
                            let ops : Array<CompileTemplates> = arg.val;
                            for(let i = 0; i != ops.length; ++i)
                            {
                                if(genomeView.genome)
                                {
                                    if(ops[i].name == "compileTemplates" && ops[i].flags.done && ops[i].flags.success)
                                    {
                                        if(ops[i].compileBase)
                                        {
                                            if(ops[i].figure.uuid == genomeView.genome.uuid)
                                            {
                                                svgCache.baseFigureSVGCache.makeDirty();
                                                svgCache.baseFigureSVGCache.buildingSVG = false;
                                            }

                                        }
                                    }
                                    viewMgr.render();
                                }
                            }
                        }
                    }
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
