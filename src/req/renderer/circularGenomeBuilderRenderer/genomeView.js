"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const electron = require("electron");
const ipc = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const Dialogs = require("dialogs");
const dialogs = Dialogs();
const viewMgr = require("./../viewMgr");
const cf = require("./../circularFigure");
const plasmid = require("./../circularGenome/plasmid");
require("angular");
require("angularplasmid");
let app = angular.module('myApp', ['angularplasmid']);
class GenomeView extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
        this.firstRender = true;
    }
    onMount() { }
    onUnMount() { }
    showContigCreator() {
        let masterView = viewMgr.getViewByName("masterView");
        let contigCreator = viewMgr.getViewByName("contigCreator", masterView.views);
        contigCreator.show();
        viewMgr.render();
    }
    exportSVG() {
        let self = this;
        dialog.showSaveDialog({
            title: "Save figure as SVG",
            filters: [
                {
                    name: "Scalable Vector Graphic",
                    extensions: [
                        "svg"
                    ]
                }
            ]
        }, function (fileName) {
            if (fileName) {
                fs.writeFileSync(fileName, new XMLSerializer().serializeToString(document.getElementById(self.div).children[0]));
            }
        });
    }
    markerOnClick($event, $marker, uuid) {
        let masterView = viewMgr.getViewByName("masterView");
        let contigEditor = viewMgr.getViewByName("contigEditor", masterView.views);
        contigEditor.contiguuid = uuid;
        contigEditor.show();
        viewMgr.render();
    }
    figureNameOnClick() {
        let self = this;
        dialogs.prompt("Figure Name", this.genome.name, function (text) {
            if (text) {
                self.genome.name = text;
                cf.cacheBaseFigure(self.genome);
                let masterView = viewMgr.getViewByName("masterView");
                let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
                masterView.firstRender = true;
                genomeView.firstRender = true;
                masterView.dataChanged();
                viewMgr.render();
            }
        });
    }
    inputRadiusOnChange() {
        this.genome.height = this.genome.radius * 10;
        this.genome.width = this.genome.radius * 10;
        this.postRender();
        let self = this;
    }
    showBPTrackOnChange() {
        let masterView = viewMgr.getViewByName("masterView");
        let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
        genomeView.firstRender = true;
        viewMgr.render();
    }
    renderView() {
        let self = this;
        if (this.genome) {
            if (this.firstRender) {
                try {
                    document.body.removeChild(document.getElementById("controls"));
                }
                catch (err) { }
                try {
                    document.body.removeChild(document.getElementById(this.div));
                }
                catch (err) { }
                $("#" + this.div).remove();
                let totalBP = 0;
                for (let i = 0; i != this.genome.contigs.length; ++i) {
                    totalBP += this.genome.contigs[i].bp;
                }
                let $div = $(`
                <div id="controls">
                    <button style="float:right;" ng-click="showContigCreator()">Add Contig</button>
                    <button style="float:right;" ng-click="exportSVG()">Export as SVG</button>
                    <input type="number" ng-model="genome.radius" ng-change="inputRadiusOnChange()" min="0" max="1000" required>
                     <label>Show BP Positions:
                        <input type="checkbox" ng-model="genome.circularFigureBPTrackOptions.showLabels" ng-true-value="1" ng-false-value="0" ng-change="showBPTrackOnChange()">
                     </label>
                     ${(() => {
                    let res = ``;
                    if (this.genome.circularFigureBPTrackOptions.showLabels) {
                        res += `
                                <br />
                                <label>Interval:
                                    <input type="number" ng-model="genome.circularFigureBPTrackOptions.interval" required>
                                </label>
                             `;
                    }
                    return res;
                })()}
                </div>
                <div id="${this.div}" style="z-index=-1;">
                    ${plasmid.add({
                    sequenceLength: totalBP.toString(),
                    plasmidHeight: "{{genome.height}}",
                    plasmidWidth: "{{genome.width}}"
                })}
                        ${cf.getBaseFigureFromCache(this.genome)}
                        ${(() => {
                    let res = "";
                    for (let i = 0; i != self.genome.renderedCoverageTracks.length; ++i) {
                        if (self.genome.renderedCoverageTracks[i].checked) {
                            res += fs.readFileSync(self.genome.renderedCoverageTracks[i].path);
                        }
                    }
                    return res;
                })()}
                    ${plasmid.end()}
                </div>
                `);
                $(document.body).append($div);
                angular.element(document).injector().invoke(function ($compile) {
                    let scope = angular.element($div).scope();
                    scope.genome = self.genome;
                    scope.alignData = self.alignData;
                    scope.markerOnClick = self.markerOnClick;
                    scope.figureNameOnClick = self.figureNameOnClick;
                    scope.inputRadiusOnChange = self.inputRadiusOnChange;
                    scope.showBPTrackOnChange = self.showBPTrackOnChange;
                    scope.exportSVG = self.exportSVG;
                    scope.showContigCreator = self.showContigCreator;
                    scope.postRender = self.postRender;
                    scope.firstRender = self.firstRender;
                    scope.div = self.div;
                    $compile($div)(scope);
                });
                this.firstRender = false;
            }
        }
        return undefined;
    }
    postRender() {
        if (this.genome !== undefined) {
            let div = document.getElementById(this.div);
            div.style.zIndex = "-1";
            div.style.position = "absolute";
            div.style.height = `${$(window).height()}px`;
            div.style.width = `${$(window).width()}px`;
            let x = 0;
            let y = 0;
            x = ($(window).width() / 2) - (this.genome.width / 2);
            y = ($(window).height() / 2) - (this.genome.height / 2);
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
        }
    }
    dataChanged() { }
    divClickEvents(event) { }
}
exports.GenomeView = GenomeView;
function addView(arr, div) {
    arr.push(new GenomeView("genomeView", div));
}
exports.addView = addView;
