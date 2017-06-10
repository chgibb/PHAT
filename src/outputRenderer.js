"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./req/renderer/viewMgr");
const masterView = require("./req/renderer/OutputRenderer/masterView");
const $ = require("jquery");
window.$ = $;
require("./req/renderer/commonBehaviour");
$(function () {
    masterView.addView(viewMgr.views, "view");
    viewMgr.changeView("masterReportView");
    viewMgr.render();
    ipc.on("output", function (event, arg) {
        if (arg.action === "getKey" || arg.action === "keyChange") {
            if (arg.key == "fastqInputs" && arg.val !== undefined)
                viewMgr.getViewByName("report", viewMgr.getViewByName("masterReportView").views).fastqInputs = arg.val;
        }
        viewMgr.render();
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "output"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "QC",
        key: "QCData",
        replyChannel: "output"
    });
    ipc.send("getKey", {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "output"
    });
    ipc.send("getKey", {
        action: "keySub",
        channel: "QC",
        key: "QCData",
        replyChannel: "output"
    });
});
