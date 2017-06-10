"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./../viewMgr");
const circularFigure_1 = require("./../circularFigure");
const GenomeView = require("./genomeView");
const RightPanel = require("./rightPanel");
const contigEditor = require("./contigEditor");
const contigCreator = require("./contigCreator");
function addView(arr, div) {
    arr.push(new View(div));
}
exports.addView = addView;
class View extends viewMgr.View {
    constructor(div) {
        super("masterView", div);
        this.views = new Array();
        this.firstRender = true;
        this.leftPanelOpen = false;
        this.rightPanelOpen = false;
        this.circularFigures = new Array();
        this.fastaInputs = new Array();
    }
    onMount() {
        GenomeView.addView(this.views, "genomeView");
        RightPanel.addView(this.views, "rightSlideOutPanel");
        contigEditor.addView(this.views, "contigEditor");
        contigCreator.addView(this.views, "contigCreator");
        for (let i = 0; i != this.views.length; ++i) {
            this.views[i].onMount();
        }
        let self = this;
        window.onbeforeunload = function (e) {
            self.dataChanged();
        };
    }
    onUnMount() {
        for (let i = 0; i != this.views.length; ++i) {
            this.views[i].onUnMount();
        }
    }
    renderView() {
        if (this.firstRender) {
            this.leftPanelOpen = false;
            this.rightPanelOpen = false;
            this.firstRender = false;
            return `
                <button id="leftPanel" class="leftSlideOutPanel">Refs</button>
                <button id="rightPanel" class="rightSlideOutPanel">Coverage Options</button>
                <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                    <div id="rightSlideOutPanelView">
                    </div>
                </div>
                <div id="leftSlideOutPanel" class="leftSlideOutPanel">
                ${(() => {
                let res = "\n";
                if (this.fastaInputs) {
                    for (let i = 0; i != this.fastaInputs.length; ++i) {
                        if (this.fastaInputs[i].checked && this.fastaInputs[i].indexed) {
                            res += `<div id ="${this.fastaInputs[i].uuid}">
                                                <h3>${this.fastaInputs[i].alias}</h3><br />
                                                <button id="${this.fastaInputs[i].uuid}_newFigure" style="float:left;">New Figure</button><br /><br />
                                                `;
                            for (let k = 0; k != this.circularFigures.length; ++k) {
                                if (this.circularFigures[k].uuidFasta == this.fastaInputs[i].uuid) {
                                    res += `<div class="refFigureBlock"><input style="display:inline-block;" type="radio" id="${this.circularFigures[k].uuid}" name="selectedFigure" /><p style="display:inline-block;">${this.circularFigures[k].name}</p></div>`;
                                }
                            }
                            res += `</div>`;
                        }
                    }
                }
                return res;
            })()}
                    </div>
                    <div id="contigEditor" class="modal">
                    </div>
                    <div id="contigCreator" class="modal">
                    </div>
                `;
        }
        for (let i = 0; i != this.views.length; ++i) {
            this.views[i].render();
        }
        this.postRender();
        return undefined;
    }
    postRender() {
        for (let i = 0; i != this.views.length; ++i) {
            this.views[i].postRender();
        }
    }
    dataChanged() {
        ipc.send("saveKey", {
            action: "saveKey",
            channel: "circularGenomeBuilder",
            key: "circularFigures",
            val: this.circularFigures
        });
    }
    divClickEvents(event) {
        let me = this;
        if (event.target.id == "rightPanel") {
            $("#rightSlideOutPanel").animate({
                "margin-right": (function () {
                    if (!me.rightPanelOpen) {
                        me.rightPanelOpen = true;
                        return "+=50%";
                    }
                    if (me.rightPanelOpen) {
                        me.rightPanelOpen = false;
                        return "-=50%";
                    }
                    return "";
                })()
            });
        }
        if (event.target.id == "leftPanel") {
            $("#leftSlideOutPanel").animate({
                "margin-left": (function () {
                    if (!me.leftPanelOpen) {
                        me.leftPanelOpen = true;
                        return "+=50%";
                    }
                    if (me.leftPanelOpen) {
                        me.leftPanelOpen = false;
                        return "-=50%";
                    }
                    return "";
                })()
            });
        }
        let genomeView = viewMgr.getViewByName("genomeView", this.views);
        let rightPanel = viewMgr.getViewByName("rightPanel", this.views);
        if (this.fastaInputs) {
            for (let i = 0; i != this.fastaInputs.length; ++i) {
                if (event.target.id == `${this.fastaInputs[i].uuid}_newFigure`) {
                    this.circularFigures.push(new circularFigure_1.CircularFigure("New Figure", this.fastaInputs[i].uuid, this.fastaInputs[i].contigs));
                    genomeView.genome = this.circularFigures[this.circularFigures.length - 1];
                    this.dataChanged();
                    this.firstRender = true;
                    genomeView.firstRender = true;
                    rightPanel.selectedAlignment = undefined;
                    viewMgr.render();
                    return;
                }
            }
        }
        for (let i = 0; i != this.circularFigures.length; ++i) {
            if (event.target.id == this.circularFigures[i].uuid) {
                genomeView.genome = this.circularFigures[i];
                genomeView.firstRender = true;
                rightPanel.selectedAlignment = undefined;
                viewMgr.render();
                return;
            }
        }
    }
}
exports.View = View;
