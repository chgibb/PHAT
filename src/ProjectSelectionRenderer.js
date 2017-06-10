"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const app = remote.app;
const jsonFile = require("jsonfile");
const Dialogs = require("dialogs");
const dialogs = Dialogs();
const getAppPath_1 = require("./req/getAppPath");
getAppPath_1.getReadable("");
getAppPath_1.getWritable("");
getAppPath_1.getReadableAndWritable("");
const projectManifest_1 = require("./req/projectManifest");
projectManifest_1.setManifestsPath(getAppPath_1.getReadableAndWritable(""));
const checkServerPermission_1 = require("./req/checkServerPermission");
const formatByteString_1 = require("./req/renderer/formatByteString");
const viewMgr = require("./req/renderer/viewMgr");
const projectsView = require("./req/renderer/ProjectSelectionRenderer/projectsView");
const $ = require("jquery");
window.$ = $;
require("./req/renderer/commonBehaviour");
function refreshProjects() {
    jsonFile.readFile(projectManifest_1.getProjectManifests(), function (err, obj) {
        let projectsView = viewMgr.getViewByName("projectsView");
        projectsView.projects = obj;
        viewMgr.render();
    });
}
$(function () {
    console.log("app Path: " + app.getAppPath());
    console.log("app data: " + app.getPath("appData"));
    console.log("user data: " + app.getPath("userData"));
    dialogs.prompt("Enter Access Token", "", function (token) {
        checkServerPermission_1.checkServerPermission(token).then(() => {
            ipc.send("saveKey", {
                action: "saveKey",
                channel: "application",
                key: "auth",
                val: { token: token }
            });
            ipc.send("runOperation", {
                opName: "checkForUpdate"
            });
        }).catch((err) => {
            let remote = electron.remote;
            remote.app.quit();
        });
    });
    refreshProjects();
    ipc.send("keySub", {
        action: "keySub",
        channel: "application",
        key: "operations",
        replyChannel: "projectSelection"
    });
    projectsView.addView(viewMgr.views, "projects");
    viewMgr.changeView("projectsView");
    ipc.on("projectSelection", function (event, arg) {
        if (arg.action == "getKey" || arg.action == "keyChange") {
            if (arg.key == "operations" && arg.val !== undefined) {
                let ops = arg.val;
                for (let i = 0; i != ops.length; ++i) {
                    if (ops[i].name == "openProject" && ops[i].extraData !== undefined) {
                        document.body.innerHTML = `
                                    <h1>Unpacked ${ops[i].extraData.unPacked} of ${ops[i].extraData.toUnpack}</h1>
                                `;
                        return;
                    }
                    if (ops[i].flags.done && ops[i].flags.success && ops[i].name == "checkForUpdate") {
                        dialogs.confirm(`PHAT ${ops[i].extraData.tag_name} is available. Download and install?`, `More PHATness`, (ok) => {
                            if (ok) {
                                ipc.send("runOperation", {
                                    opName: "downloadAndInstallUpdate"
                                });
                            }
                        });
                    }
                    if (ops[i].name == "downloadAndInstallUpdate" && ops[i].extraData !== undefined) {
                        document.body.innerHTML = `
                                    <h1>Downloaded: ${formatByteString_1.default(ops[i].extraData.downloadProgress)}</h1><br />
                                    <h2>PHAT will close itself when the download is complete. Please wait a few minutes before restarting PHAT.</h2>

                                `;
                        return;
                    }
                    if (ops[i].name == "newProject")
                        refreshProjects();
                }
            }
        }
    });
});
