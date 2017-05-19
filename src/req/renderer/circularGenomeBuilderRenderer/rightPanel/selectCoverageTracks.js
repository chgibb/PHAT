"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./../../viewMgr");
require("@claviska/jquery-minicolors");
class SelectCoverageTracks extends viewMgr.View {
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
            let res = `<h2>Available Tracks</h2>`;
            if (this.genome.renderedCoverageTracks.length >= 1) {
                for (let i = 0; i != this.genome.renderedCoverageTracks.length; ++i) {
                    for (let k = 0; k != this.genome.contigs.length; ++k) {
                        if (this.genome.renderedCoverageTracks[i].uuidContig == this.genome.contigs[k].uuid && this.genome.renderedCoverageTracks[i].uuidAlign == this.selectedAlignment.uuid) {
                            res += `<div><input style="display:inline-block;" type="checkbox" id="${this.genome.renderedCoverageTracks[i].uuid}" /><h3 style="display:inline-block;color:${this.genome.renderedCoverageTracks[i].colour}">${this.genome.contigs[k].name}</h3></div>`;
                        }
                    }
                }
                return res;
            }
            return "";
        })()}
        `;
        res += `<input type="text" id="colourPicker" data-format="rgb" value="rgb(0, 0, 0)">`;
        res += `
            ${(() => {
            let res = "";
            for (let i = 0; i != this.genome.contigs.length; ++i) {
                if (this.genome.contigs[i].uuid != "filler") {
                    res += `<div><p style="display:inline-block;">${this.genome.contigs[i].name}</p><input style="display:inline-block;" type="button" id="${this.genome.contigs[i].uuid}" value="Generate Visualization" /></div>`;
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
            if (this.genome.contigs[i].uuid == event.target.id) {
                masterView.dataChanged();
                ipc.send("runOperation", {
                    opName: "renderCoverageTrackForContig",
                    figureuuid: this.genome.uuid,
                    alignuuid: this.selectedAlignment.uuid,
                    uuid: event.target.id,
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
        if (rebuildTracks) {
            genomeView.firstRender = true;
            viewMgr.render();
        }
    }
}
exports.SelectCoverageTracks = SelectCoverageTracks;
function addView(arr, div) {
    arr.push(new SelectCoverageTracks("selectCoverageTracks", div));
}
exports.addView = addView;
