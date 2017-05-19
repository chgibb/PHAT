"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./req/renderer/viewMgr");
const summary = require("./req/renderer/QCRenderer/summaryView");
const report = require("./req/renderer/QCRenderer/reportView");
require("./req/renderer/commonBehaviour");
const $ = require("jquery");
window.$ = $;
require("./req/renderer/commonBehaviour");
$(function () {
    summary.addView(viewMgr.views, 'reports');
    report.addView(viewMgr.views, 'reports');
    viewMgr.changeView("summary");
    ipc.send("keySub", {
        action: "keySub",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "QC"
    });
    ipc.send("getKey", {
        action: "getKey",
        channel: "input",
        key: "fastqInputs",
        replyChannel: "QC"
    });
    ipc.send("keySub", {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "QC"
    });
    let validFastQCOut = new RegExp("[0-9]|[.]", "g");
    let trimOutFastQCPercentage = new RegExp("[0-9][0-9][%]|[0-9][%]", "g");
    ipc.on('QC', function (event, arg) {
        if (arg.action == "getKey" || arg.action == "keyChange") {
            if (arg.key == "fastqInputs") {
                if (arg.val !== undefined) {
                    viewMgr.getViewByName("summary").fastqInputs = arg.val;
                    viewMgr.render();
                }
            }
            if (arg.key == "operations") {
                let operations = arg.val;
                for (let i = 0; i != operations.length; ++i) {
                    if (operations[i].name == "generateFastQCReport") {
                        let op = operations[i];
                        if (op.spawnUpdate && op.spawnUpdate.unBufferedData) {
                            if (validFastQCOut.test(op.spawnUpdate.unBufferedData)) {
                                let regResult = trimOutFastQCPercentage.exec(op.spawnUpdate.unBufferedData);
                                if (regResult && regResult[0]) {
                                    let fastqInputs = viewMgr.getViewByName("summary").fastqInputs;
                                    for (let i = 0; i != fastqInputs.length; ++i) {
                                        if (fastqInputs[i].uuid == op.fastq.uuid) {
                                            $(`#${op.fastq.uuid}`).text(regResult[0]);
                                            return;
                                        }
                                    }
                                }
                            }
                            return;
                        }
                    }
                }
            }
        }
        viewMgr.render();
    });
    viewMgr.render();
});
