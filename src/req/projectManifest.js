"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let manifestFile = "projectManifests.json";
let manifestsPath = "";
function setManifestsPath(path) {
    manifestsPath = path;
}
exports.setManifestsPath = setManifestsPath;
function getProjectManifests() {
    if (manifestsPath)
        return manifestsPath + "/" + manifestFile;
    else
        throw new Error("manifests path not set");
}
exports.getProjectManifests = getProjectManifests;
