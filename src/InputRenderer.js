"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./req/renderer/viewMgr");
let debug = require("./req/renderer/sendDebugMessage");
debug.initialize("input");
const fastaView = require("./req/renderer/inputRenderer/FastaView");
const fastqView = require("./req/renderer/inputRenderer/FastqView");
const fastaBrowseDialog_1 = require("./req/renderer/inputRenderer/fastaBrowseDialog");
const fastqBrowseDialog_1 = require("./req/renderer/inputRenderer/fastqBrowseDialog");
const Input_1 = require("./req/renderer/Input");
const $ = require("jquery");
window.$ = $;
require("./req/renderer/commonBehaviour");
let input = new Input_1.default("input", ipc);
function preRender(viewRef) {
    if (viewMgr.currView == 'fastq') {
        document.getElementById('fastqButton').src = 'img/fastqButtonActive.png';
        document.getElementById('refSeqButton').src = 'img/refSeqButton.png';
    }
    else if (viewMgr.currView == 'fasta') {
        document.getElementById('fastqButton').src = 'img/fastqButton.png';
        document.getElementById('refSeqButton').src = 'img/refSeqButtonActive.png';
    }
}
viewMgr.setPreRender(preRender);
$(function () {
    fastaView.addView(viewMgr.views, 'loadedFiles', input);
    fastqView.addView(viewMgr.views, 'loadedFiles', input);
    viewMgr.changeView("fastq");
    ipc.send("getKey", {
        channel: "input",
        key: "fastqInputs",
        replyChannel: "input",
        action: "getKey"
    });
    ipc.send("getKey", {
        channel: "input",
        key: "fastaInputs",
        replyChannel: "input",
        action: "getKey"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "input"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "input"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "input"
    });
    ipc.on('input', function (event, arg) {
        if (arg.action == "getKey" || arg.action == "keyChange") {
            if (arg.key == 'fastqInputs') {
                if (arg.val !== undefined) {
                    input.fastqInputs = arg.val;
                }
            }
            if (arg.key == 'fastaInputs') {
                if (arg.val !== undefined) {
                    input.fastaInputs = arg.val;
                }
            }
            if (arg.key == "operations") {
                console.log(arg.val);
            }
        }
        viewMgr.render();
    });
    document.getElementById("fastqButton").onclick = function () {
        viewMgr.changeView("fastq");
    };
    document.getElementById("refSeqButton").onclick = function () {
        viewMgr.changeView("fasta");
    };
    document.getElementById("browseButton").onclick = function () {
        browse();
    };
    viewMgr.render();
});
function browse() {
    if (viewMgr.currView == 'fastq')
        fastqBrowseDialog_1.default(input);
    if (viewMgr.currView == 'fasta')
        fastaBrowseDialog_1.default(input);
}
