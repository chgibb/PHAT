"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonFile = require("jsonfile");
const uuidv4 = require("uuid/v4");
const getAppPath_1 = require("./getAppPath");
const projectManifest_1 = require("./projectManifest");
function newProject(name) {
    return new Promise((resolve, reject) => {
        let projects;
        try {
            projects = jsonFile.readFileSync(projectManifest_1.getProjectManifests());
        }
        catch (err) {
            projects = new Array();
        }
        let uuid = uuidv4();
        projects.push({
            alias: name,
            tarBall: getAppPath_1.getReadableAndWritable(`projects/${uuid}.phat`),
            lastOpened: Date.now(),
            created: Date.now(),
            uuid: uuid
        });
        jsonFile.writeFileSync(projectManifest_1.getProjectManifests(), projects, { spaces: 4 });
        resolve();
    });
}
exports.newProject = newProject;
