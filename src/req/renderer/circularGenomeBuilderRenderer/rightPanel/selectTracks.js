"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./../../viewMgr");
require("@claviska/jquery-minicolors");
class SelectTracks extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        let masterView = viewMgr.getViewByName("masterView");
        let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
        let rightPanel = viewMgr.getViewByName("rightPanel", masterView.views);
        this.genome = genomeView.genome;
        this.selectedAlignment = rightPanel.selectedAlignment;
        let res = `
            <button id="goBack">Go Back</button>
            ${(() => {
            let res = "";
            if (this.genome.renderedCoverageTracks.length >= 1) {
                res += `<h2>Available Coverage Plots</h2>`;
                for (let i = 0; i != this.genome.renderedCoverageTracks.length; ++i) {
                    for (let k = 0; k != this.genome.contigs.length; ++k) {
                        if (this.genome.renderedCoverageTracks[i].uuidContig == this.genome.contigs[k].uuid && this.genome.renderedCoverageTracks[i].uuidAlign == this.selectedAlignment.uuid) {
                            res += `<div><input style="display:inline-block;" type="checkbox" id="${this.genome.renderedCoverageTracks[i].uuid}" /><h3 style="display:inline-block;color:${this.genome.renderedCoverageTracks[i].colour}">${this.genome.contigs[k].name}</h3></div>`;
                        }
                    }
                }
            }
            if (this.genome.renderedSNPTracks.length >= 1) {
                res += `<h2>Available SNP Markers</h2>`;
                for (let i = 0; i != this.genome.renderedSNPTracks.length; ++i) {
                    for (let k = 0; k != this.genome.contigs.length; ++k) {
                        if (this.genome.renderedSNPTracks[i].uuidContig == this.genome.contigs[k].uuid && this.genome.renderedSNPTracks[i].uuidAlign == this.selectedAlignment.uuid) {
                            res += `<div><input style="display:inline-block;" type="checkbox" id="${this.genome.renderedSNPTracks[i].uuid}" /><h3 style="display:inline-block;color:${this.genome.renderedSNPTracks[i].colour}">${this.genome.contigs[k].name}</h3></div>`;
                        }
                    }
                }
            }
            if (res)
                return res;
            return "";
        })()}
        `;
        res += `<input type="text" id="colourPicker" data-format="rgb" value="rgb(0, 0, 0)">`;
        res += `
            ${(() => {
            let res = "";
            for (let i = 0; i != this.genome.contigs.length; ++i) {
                if (this.genome.contigs[i].uuid != "filler") {
                    res += `
                        <div>
                            <p style="display:inline-block;">${this.genome.contigs[i].name}</p>
                            <input style="display:inline-block;" type="button" id="${this.genome.contigs[i].uuid + "coverage"}" value="Generate Coverage Plot" />
                            <input style="display:inline-block;" type="button" id="${this.genome.contigs[i].uuid + "snp"}" value="Generate SNP Markers" />
                        </div>`;
                }
            }
            return res;
        })()}
        `;
        return res;
    }
    postRender() {
        let colourPicker = document.getElementById("colourPicker");
        $(colourPicker).minicolors({
            control: "hue",
            defaultValue: "",
            format: "rgb",
            keywords: "",
            inline: false,
            swatches: [],
            theme: "default",
            change: function (hex, opacity) { }
        });
        for (let i = 0; i != this.genome.renderedCoverageTracks.length; ++i) {
            if (this.genome.renderedCoverageTracks[i].checked) {
                try {
                    document.getElementById(this.genome.renderedCoverageTracks[i].uuid).checked = true;
                }
                catch (err) { }
            }
        }
        for (let i = 0; i != this.genome.renderedSNPTracks.length; ++i) {
            if (this.genome.renderedSNPTracks[i].checked) {
                try {
                    document.getElementById(this.genome.renderedSNPTracks[i].uuid).checked = true;
                }
                catch (err) { }
            }
        }
    }
    dataChanged() { }
    divClickEvents(event) {
        if (!event.target.id)
            return;
        let masterView = viewMgr.getViewByName("masterView");
        let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
        let rightPanel = viewMgr.getViewByName("rightPanel", masterView.views);
        if (event.target.id == "goBack") {
            rightPanel.selectedAlignment = undefined;
            viewMgr.render();
        }
        for (let i = 0; i != this.genome.contigs.length; ++i) {
            if (this.genome.contigs[i].uuid + "coverage" == event.target.id) {
                masterView.dataChanged();
                ipc.send("runOperation", {
                    opName: "renderCoverageTrackForContig",
                    figureuuid: this.genome.uuid,
                    alignuuid: this.selectedAlignment.uuid,
                    uuid: this.genome.contigs[i].uuid,
                    colour: $(document.getElementById("colourPicker")).minicolors("rgbString")
                });
                break;
            }
            if (this.genome.contigs[i].uuid + "snp" == event.target.id) {
                masterView.dataChanged();
                ipc.send("runOperation", {
                    opName: "renderSNPTrackForContig",
                    figureuuid: this.genome.uuid,
                    alignuuid: this.selectedAlignment.uuid,
                    uuid: this.genome.contigs[i].uuid,
                    colour: $(document.getElementById("colourPicker")).minicolors("rgbString")
                });
                break;
            }
        }
        let rebuildTracks = false;
        for (let i = 0; i != this.genome.renderedCoverageTracks.length; ++i) {
            if (this.genome.renderedCoverageTracks[i].uuid == event.target.id) {
                this.genome.renderedCoverageTracks[i].checked = document.getElementById(event.target.id).checked;
                rebuildTracks = true;
                break;
            }
        }
        for (let i = 0; i != this.genome.renderedSNPTracks.length; ++i) {
            if (this.genome.renderedSNPTracks[i].uuid == event.target.id) {
                this.genome.renderedSNPTracks[i].checked = document.getElementById(event.target.id).checked;
                rebuildTracks = true;
                break;
            }
        }
        if (rebuildTracks) {
            genomeView.firstRender = true;
            viewMgr.render();
        }
    }
}
exports.SelectTracks = SelectTracks;
function addView(arr, div) {
    arr.push(new SelectTracks("selectCoverageTracks", div));
}
exports.addView = addView;
