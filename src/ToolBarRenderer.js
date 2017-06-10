"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const Dialogs = require("dialogs");
const dialogs = Dialogs();
const $ = require("jquery");
window.$ = $;
require("./req/renderer/commonBehaviour");
$(function () {
    document.getElementById("input").onclick = function (ev) {
        ipc.send("openWindow", { refName: "input" });
    };
    document.getElementById("QC").onclick = function (ev) {
        ipc.send("openWindow", { refName: "QC" });
    };
    document.getElementById("align").onclick = function (ev) {
        ipc.send("openWindow", { refName: "align" });
    };
    document.getElementById("pathogen").onclick = function (ev) {
        ipc.send("openWindow", { refName: "pathogen" });
    };
    document.getElementById("output").onclick = function (ev) {
        ipc.send("openWindow", { refName: "output" });
    };
    document.getElementById("circularGenomeBuilder").onclick = function (ev) {
        ipc.send("openWindow", { refName: "circularGenomeBuilder" });
    };
    ipc.send("keySub", {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "toolBar"
    });
    ipc.on("toolBar", function (event, arg) {
        if (arg.action == "getKey" || arg.action == "keyChange") {
            if (arg.key == "operations" && arg.val !== undefined) {
                let ops = arg.val;
                for (let i = 0; i != ops.length; ++i) {
                    if (ops[i].flags.done && ops[i].name != "checkForUpdate") {
                        let notification = new Notification(ops[i].flags.success ? "Success" : "Failure", {
                            body: `
                                        ${(() => {
                                if (ops[i].flags.success) {
                                    return `
                                                    ${ops[i].name} has completed successfully
                                                `;
                                }
                                else {
                                    return `
                                                    ${ops[i].name} has failed
                                                    ${JSON.stringify(ops[i].extraData)}
                                                `;
                                }
                            })()}
                                    `
                        });
                    }
                }
            }
        }
    });
});
