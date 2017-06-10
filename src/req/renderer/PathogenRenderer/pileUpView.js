"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const bootStrapCodeCache_1 = require("./../../bootStrapCodeCache");
const getAppPath_1 = require("./../../getAppPath");
const fasta_1 = require("./../../fasta");
const viewMgr = require("./../viewMgr");
class PileUpView extends viewMgr.View {
    constructor(div) {
        super('pileUp', div);
        this.report = "";
        this.viewer = {};
        this.selectedFastaInputs = new Array();
        this.aligns = new Array();
    }
    onMount() {
        if (!window.pileup) {
            bootStrapCodeCache_1.bootStrapCodeCache(getAppPath_1.getReadable("pileup.js"), "./pileup", getAppPath_1.getReadableAndWritable("pileup.cdata"));
        }
        var twoBit;
        var refName;
        var bam;
        var bai;
        var bamName;
        var contig;
        for (let i = 0; i != this.aligns.length; ++i) {
            if (this.aligns[i].uuid == this.report) {
                twoBit = fasta_1.get2BitPath(this.aligns[i].fasta);
                contig = this.aligns[i].fasta.contigs[0].name.split(' ')[0];
                bam = getAppPath_1.getReadableAndWritable("rt/AlignmentArtifacts/" + this.report + "/out.sorted.bam");
                bai = getAppPath_1.getReadableAndWritable("rt/AlignmentArtifacts/" + this.report + "/out.sorted.bam.bai");
                bamName = this.aligns[i].alias;
                break;
            }
        }
        this.viewer = window.pileup.create(document.getElementById(this.div), {
            range: {
                contig: contig,
                start: 0,
                stop: 100
            },
            tracks: [
                {
                    viz: window.pileup.viz.genome(),
                    isReference: true,
                    data: window.pileup.formats.twoBit({
                        url: Path.resolve(twoBit)
                    }),
                    name: refName
                },
                {
                    viz: window.pileup.viz.pileup(),
                    data: window.pileup.formats.bam({
                        url: Path.resolve(bam),
                        indexUrl: Path.resolve(bai)
                    }),
                    cssClass: 'normal',
                    name: bamName
                }
            ]
        });
        var html = "";
        html += "<button id='goBack'>Go Back</button><br/>";
        document.getElementById("goBackDiv").innerHTML = html;
        var me = this;
        document.getElementById("goBack").addEventListener("click", function (ev) {
            me.report = "";
            viewMgr.changeView('report');
        }, false);
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 1000);
    }
    onUnMount() {
        this.viewer.destroy();
        document.getElementById("goBackDiv").innerHTML = "";
    }
    renderView() {
        return "";
    }
    postRender() { }
    divClickEvents(event) {
        if (!event || !event.target || !event.target.id)
            return;
        if (event.target.id == "goBack") {
            this.report = "";
            viewMgr.changeView('report');
            return;
        }
    }
    dataChanged() { }
}
exports.PileUpView = PileUpView;
function addView(arr, div) {
    arr.push(new PileUpView(div));
}
exports.addView = addView;
