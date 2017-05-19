"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const Dialogs = require("dialogs");
const dialogs = Dialogs();
const viewMgr = require("./../viewMgr");
const cf = require("./../circularFigure");
class ContigCreator extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
        this.contigStart = -1;
        this.contigEnd = -1;
        this.contigVAdjust = 0;
    }
    onMount() { }
    onUnMount() { }
    forceReRender() {
        cf.cacheBaseFigure(this.genome);
        let masterView = viewMgr.getViewByName("masterView");
        let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
        genomeView.firstRender = true;
        masterView.firstRender = true;
        masterView.dataChanged();
        viewMgr.render();
    }
    show() {
        this.mount();
        this.contigStart = -1;
        this.contigEnd = -1;
        document.getElementById(this.div).style.display = "block";
    }
    hide() {
        let inputStart = parseInt(document.getElementById("contigStart").value);
        let inputEnd = parseInt(document.getElementById("contigEnd").value);
        let vAdjust = parseInt(document.getElementById("contigVAdjust").value);
        if (inputStart && inputEnd && inputEnd != 0) {
            this.contigStart = inputStart;
            this.contigEnd = inputEnd;
            this.contigVAdjust = vAdjust;
            let contig = new cf.Contig();
            cf.initContigForDisplay(contig, true);
            contig.start = this.contigStart;
            contig.end = this.contigEnd;
            contig.vAdjust = this.contigVAdjust;
            contig.alias = "New Contig";
            contig.name = "Custom Annotation";
            this.genome.customContigs.push(contig);
            this.forceReRender();
            console.log("rerendered");
        }
        console.log(inputStart + " " + inputEnd);
        document.getElementById(this.div).style.display = "none";
        this.unMount();
    }
    renderView() {
        try {
            let masterView = viewMgr.getViewByName("masterView");
            let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
            this.genome = genomeView.genome;
            return `
                <div class="modalContent">
                    <div class="modalHeader">
                        <span id="closeCreator" class="modalCloseButton">&times;</span>
                        <p style="display:inline-block;">Vertical Adjustment</p>
                        <input type="text" id="contigVAdjust"style="display:inline-block;" />
                        <p style="display:inline-block;">Start</p>
                        <input type="text" id="contigStart"style="display:inline-block;" />
                        <p style="display:inline-block;">End</p>
                        <input type="text" id="contigEnd" style="display:inline-block;" />
                    </div>
                    <div class="modalBody">
                    </div>
                    <div class="modalFooter">
                    </div>
                </div>
            `;
        }
        catch (err) {
            return undefined;
        }
    }
    postRender() { }
    dataChanged() { }
    divClickEvents(event) {
        if (event.target.id == "closeCreator") {
            this.hide();
        }
    }
}
exports.ContigCreator = ContigCreator;
function addView(arr, div) {
    arr.push(new ContigCreator("contigCreator", div));
}
exports.addView = addView;
