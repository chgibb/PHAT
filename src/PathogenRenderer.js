"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./req/renderer/viewMgr");
const pileUpView = require("./req/renderer/PathogenRenderer/pileUpView");
const reportView = require("./req/renderer/PathogenRenderer/reportView");
const $ = require("jquery");
window.$ = $;
require("./req/renderer/commonBehaviour");
$(function () {
    pileUpView.addView(viewMgr.views, "view");
    reportView.addView(viewMgr.views, "view");
    viewMgr.changeView("report");
    ipc.on('pathogen', function (event, arg) {
        if (arg.action === "getKey" || arg.action === "keyChange") {
            if (arg.key == 'aligns') {
                if (arg.val !== undefined) {
                    viewMgr.getViewByName("pileUp").aligns = arg.val;
                    viewMgr.getViewByName("report").aligns = arg.val;
                }
                viewMgr.render();
            }
            if (arg.key == 'fastaInputs') {
                if (arg.val !== undefined) {
                    viewMgr.getViewByName("pileUp").selectedFastaInputs = new Array();
                    viewMgr.getViewByName("report").selectedFastaInputs = new Array();
                    for (let i = 0; i != arg.val.length; ++i) {
                        if (arg.val[i].checked) {
                            viewMgr.getViewByName("pileUp").selectedFastaInputs.push(arg.val[i]);
                            viewMgr.getViewByName("report").selectedFastaInputs.push(arg.val[i]);
                        }
                    }
                    viewMgr.render();
                }
            }
            if (arg.key == 'fastqInputs') {
                if (arg.val !== undefined) {
                    viewMgr.getViewByName("report").selectedFastqInputs = new Array();
                    for (let i = 0; i != arg.val.length; ++i) {
                        if (arg.val[i].checked) {
                            viewMgr.getViewByName("report").selectedFastqInputs.push(arg.val[i]);
                        }
                    }
                    viewMgr.render();
                }
            }
            viewMgr.render();
        }
    });
    ipc.send("getKey", {
        action: "getKey",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "pathogen"
    });
    ipc.send("getKey", {
        action: "getKey",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "pathogen"
    });
    ipc.send("getKey", {
        action: "getKey",
        channel: "align",
        key: "aligns",
        replyChannel: "pathogen"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "pathogen"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "input",
        key: "fastaInputs",
        replyChannel: "pathogen"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "align",
        key: "aligns",
        replyChannel: "pathogen"
    });
    viewMgr.render();
});
$(window).resize(function () {
    document.getElementById("view").style.height = $(window).height() + "px";
});
