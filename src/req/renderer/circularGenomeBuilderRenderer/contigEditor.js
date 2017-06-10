"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const Dialogs = require("dialogs");
const dialogs = Dialogs();
const viewMgr = require("./../viewMgr");
const cf = require("./../circularFigure");
class ContigEditor extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
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
        document.getElementById(this.div).style.display = "block";
    }
    hide() {
        let colour = $(document.getElementById("fillColourPicker")).minicolors("rgbString");
        let fontColour = $(document.getElementById("fontColourPicker")).minicolors("rgbString");
        let toggleVisibility = document.getElementById("toggleVisibility");
        let shouldReRender = false;
        if (colour != this.contig.color) {
            this.contig.color = colour;
            shouldReRender = true;
        }
        if (fontColour != this.contig.fontFill) {
            this.contig.fontFill = fontColour;
            shouldReRender = true;
        }
        if (toggleVisibility.checked == true && this.contig.opacity == 0)
            shouldReRender = true;
        if (toggleVisibility.checked == false && this.contig.opacity == 1)
            shouldReRender = true;
        this.contig.opacity = toggleVisibility.checked ? 1 : 0;
        try {
            let vAdjust = document.getElementById("vAdjust").value;
            let start = document.getElementById("start").value;
            let end = document.getElementById("end").value;
            if (parseInt(vAdjust) != this.contig.vAdjust) {
                this.contig.vAdjust = parseInt(vAdjust);
                shouldReRender = true;
            }
            if (parseInt(start) != this.contig.start) {
                this.contig.start = parseInt(start);
                shouldReRender = true;
            }
            if (parseInt(end) != this.contig.end) {
                this.contig.end = parseInt(end);
                shouldReRender = true;
            }
        }
        catch (err) { }
        document.getElementById(this.div).style.display = "none";
        if (shouldReRender)
            this.forceReRender();
        this.unMount();
    }
    renderView() {
        try {
            if (document.getElementById(this.div).style.display == "block" && this.contiguuid) {
                let masterView = viewMgr.getViewByName("masterView");
                let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
                this.genome = genomeView.genome;
                if (this.genome) {
                    for (let i = 0; i != this.genome.contigs.length; ++i) {
                        if (this.genome.contigs[i].uuid == this.contiguuid) {
                            this.contig = this.genome.contigs[i];
                            break;
                        }
                    }
                    for (let i = 0; i != this.genome.customContigs.length; ++i) {
                        if (this.genome.customContigs[i].uuid == this.contiguuid) {
                            this.contig = this.genome.customContigs[i];
                            break;
                        }
                    }
                    return `
                        <div class="modalContent">
                            <div class="modalHeader">
                                <span id="closeEditor" class="modalCloseButton">&times;</span>
                                    <h2 id="contigAlias" style="display:inline-block;">${this.contig.alias}</h2>
                                    <input type="text" id="fontColourPicker" data-format="rgb" style="display:inline-block;" value="${this.contig.fontFill}">
                                    <input type="checkbox" id="toggleVisibility" style="display:inline-block;"/>
                                    <p style="display:inline-block;">Visible</p>
                                    <h5>${this.contig.name}</h5>
                            </div>
                            <div class="modalBody">
                                <input type="text" id="fillColourPicker" data-format="rgb" value="${this.contig.color}">
                                ${(() => {
                        if (this.contig.allowPositionChange) {
                            return `
                                            <div>
                                                <p>Vertical Adjustment</p><input type="text" id="vAdjust" value="${this.contig.vAdjust}">
                                                <p>Start</p><input style="display:inline-block;" type="text" id="start" value="${this.contig.start}">
                                                <p>End</p><input style="display:inline-block;" type="text" id="end" value="${this.contig.end}">
                                            </div>
                                        `;
                        }
                        return " ";
                    })()}
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                            <div class="modalFooter">
                            </div>
                        </div>
                    `;
                }
                return " ";
            }
            else
                return " ";
        }
        catch (err) {
            return undefined;
        }
    }
    postRender() {
        try {
            let colourPicker = document.getElementById("fillColourPicker");
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
            let fontColourPicker = document.getElementById("fontColourPicker");
            $(fontColourPicker).minicolors({
                control: "hue",
                defaultValue: "",
                format: "rgb",
                keywords: "",
                inline: false,
                swatches: [],
                theme: "default",
                change: function (hex, opacity) { }
            });
            let toggleVisibility = document.getElementById("toggleVisibility");
            if (this.contig.opacity == 0)
                toggleVisibility.checked = false;
            if (this.contig.opacity == 1)
                toggleVisibility.checked = true;
        }
        catch (err) { }
    }
    dataChanged() { }
    divClickEvents(event) {
        if (event.target.id == "contigAlias") {
            let self = this;
            dialogs.prompt("Contig Name", this.contig.alias, function (text) {
                if (text) {
                    self.contig.alias = text;
                    self.forceReRender();
                }
            });
        }
        if (event.target.id == "closeEditor") {
            this.hide();
        }
    }
}
exports.ContigEditor = ContigEditor;
function addView(arr, div) {
    arr.push(new ContigEditor("contigEditor", div));
}
exports.addView = addView;
