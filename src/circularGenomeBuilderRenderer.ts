import {ipcRenderer} from "electron";
let ipc = ipcRenderer;
import * as viewMgr from "./req/renderer/viewMgr";
import * as masterView from "./req/renderer/circularGenomeBuilderRenderer/masterView";
import * as genomeView from "./req/renderer/circularGenomeBuilderRenderer/genomeView";
import {CircularFigure,} from "./req/renderer/circularFigure";
import {SpawnRequestParams} from "./req/JobIPC";
import {GetKeyEvent,KeySubEvent} from "./req/ipcEvents";

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
        ipc.on
        (
            'circularGenomeBuilder',function(event,arg)
            {
                if(arg.action == "getKey" || arg.action == "keyChange")
                {
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val !== undefined)
                        {
                            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                            masterView.fastaInputs = arg.val;
                            masterView.firstRender = true;
                        }
                    }
                    if(arg.key == "aligns")
                    {
                        if(arg.val !== undefined)
                        {
                            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                            let rightPanelView = <genomeView.GenomeView>viewMgr.getViewByName("rightPanel",masterView.views);
                            rightPanelView.alignData = arg.val;
                        }
                    }
                    if(arg.key == "circularFigures")
                    {
                        if(arg.val !== undefined)
                        {
                            let masterView = <masterView.View>viewMgr.getViewByName("masterView");
                            let genomeView = <genomeView.GenomeView>viewMgr.getViewByName("genomeView",masterView.views);
                            let currentFigure = "";
                            //Only update panels if theres been an additional figure created
                            if((<Array<CircularFigure>>arg.val).length != masterView.circularFigures.length)
                                masterView.firstRender = true;
                            //If there's currently a figure being edited then save its id
                            if(genomeView.genome)
                                currentFigure = genomeView.genome.uuid;
                            //overwrite our figure cache with the updated one
                            masterView.circularFigures = arg.val;
                            //reassign our current figure with the (potentially changed) new one
                            if(currentFigure)
                            {
                                for(let i : number = 0; i != masterView.circularFigures.length; ++i)
                                {
                                    if(masterView.circularFigures[i].uuid == currentFigure)
                                    {
                                        genomeView.genome = masterView.circularFigures[i];
                                        break;
                                    }
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
