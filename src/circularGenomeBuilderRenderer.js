"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let ipc = electron_1.ipcRenderer;
const viewMgr = require("./req/renderer/viewMgr");
const masterView = require("./req/renderer/circularGenomeBuilderRenderer/masterView");
require("./req/renderer/commonBehaviour");
const $ = require("jquery");
window.$ = $;
$(function () {
    masterView.addView(viewMgr.views, "view");
    viewMgr.changeView("masterView");
    viewMgr.render();
    ipc.send("getKey", {
        channel: "input",
        key: "fastaInputs",
        replyChannel: "circularGenomeBuilder",
        action: "getKey"
    });
    ipc.send("getKey", {
        channel: "circularGenomeBuilder",
        key: "circularFigures",
        replyChannel: "circularGenomeBuilder",
        action: "getKey"
    });
    ipc.send("getKey", {
        channel: "align",
        key: "aligns",
        replyChannel: "circularGenomeBuilder",
        action: "getKey"
    });
    ipc.send("keySub", {
        channel: "input",
        key: "fastaInputs",
        replyChannel: "circularGenomeBuilder",
        action: "keySub"
    });
    ipc.send("keySub", {
        channel: "circularGenomeBuilder",
        key: "circularFigures",
        replyChannel: "circularGenomeBuilder",
        action: "keySub"
    });
    ipc.send("keySub", {
        channel: "align",
        key: "aligns",
        replyChannel: "circularGenomeBuilder",
        action: "keySub"
    });
    ipc.on('circularGenomeBuilder', function (event, arg) {
        if (arg.action == "getKey" || arg.action == "keyChange") {
            if (arg.key == "fastaInputs") {
                if (arg.val !== undefined) {
                    let masterView = viewMgr.getViewByName("masterView");
                    masterView.fastaInputs = arg.val;
                    masterView.firstRender = true;
                }
            }
            if (arg.key == "aligns") {
                if (arg.val !== undefined) {
                    let masterView = viewMgr.getViewByName("masterView");
                    let rightPanelView = viewMgr.getViewByName("rightPanel", masterView.views);
                    rightPanelView.alignData = arg.val;
                }
            }
            if (arg.key == "circularFigures") {
                if (arg.val !== undefined) {
                    let masterView = viewMgr.getViewByName("masterView");
                    let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
                    let currentFigure = "";
                    if (arg.val.length != masterView.circularFigures.length)
                        masterView.firstRender = true;
                    if (genomeView.genome)
                        currentFigure = genomeView.genome.uuid;
                    masterView.circularFigures = arg.val;
                    if (currentFigure) {
                        for (let i = 0; i != masterView.circularFigures.length; ++i) {
                            if (masterView.circularFigures[i].uuid == currentFigure) {
                                genomeView.genome = masterView.circularFigures[i];
                                break;
                            }
                        }
                    }
                }
            }
        }
        viewMgr.render();
    });
});
$(window).resize(function () {
    viewMgr.render();
});
