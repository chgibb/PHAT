"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
let editionString = undefined;
let editionSource = path.dirname(process.execPath) + "/edition";
function getEditionString() {
    if (!editionString) {
        try {
            editionString = fs.readFileSync(editionSource);
        }
        catch (err) {
            editionSource = process.cwd() + "/edition";
            editionString = fs.readFileSync(editionSource);
        }
    }
}
function setEditionSource(path) {
    editionSource = path;
}
exports.setEditionSource = setEditionSource;
function getEdition() {
    getEditionString();
    return editionString;
}
exports.getEdition = getEdition;
