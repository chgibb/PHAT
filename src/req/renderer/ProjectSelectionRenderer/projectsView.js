"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let ipc = electron_1.ipcRenderer;
const jsonFile = require("jsonfile");
const Dialogs = require("dialogs");
const dialogs = Dialogs();
const projectManifest_1 = require("./../../projectManifest");
const viewMgr_1 = require("./../viewMgr");
class ProjectsView extends viewMgr_1.View {
    constructor(div) {
        super("projectsView", div);
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        return `
            <button id="createNewProject">Create New Project</button>
            ${(() => {
            let res = "";
            if (!this.projects)
                "<h2>You have no projects</h2>";
            if (this.projects) {
                if (this.projects.length == 0)
                    return res;
                for (let i = 0; i != this.projects.length; ++i) {
                    let lastOpened = new Date(this.projects[i].lastOpened);
                    let created = new Date(this.projects[i].created);
                    res += `
                            <h4 class="activeHover" id="${this.projects[i].uuid}open">${this.projects[i].alias}</h4>
                            <h6>Last Opened: ${lastOpened}</h6>
                            <h6>Created: ${created}</h6>
                        `;
                }
            }
            return res;
        })()}
        `;
    }
    postRender() { }
    dataChanged() { }
    divClickEvents(event) {
        if (event.target.id == "createNewProject") {
            dialogs.prompt("Project Name", "New Project", function (text) {
                if (text) {
                    ipc.send("runOperation", {
                        opName: "newProject",
                        name: text
                    });
                }
            });
        }
        if (this.projects) {
            for (let i = 0; i != this.projects.length; ++i) {
                if (event.target.id == `${this.projects[i].uuid}open`) {
                    this.projects[i].lastOpened = Date.now();
                    jsonFile.writeFileSync(projectManifest_1.getProjectManifests(), this.projects);
                    document.getElementById(this.div).innerHTML = "Preparing";
                    ipc.send("runOperation", {
                        opName: "openProject",
                        proj: this.projects[i]
                    });
                }
            }
        }
    }
}
exports.ProjectsView = ProjectsView;
function addView(arr, div) {
    arr.push(new ProjectsView(div));
}
exports.addView = addView;
