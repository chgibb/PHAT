"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const dialog = electron.remote.dialog;
const fs = require("fs");
const tokenizeHTMLString_1 = require("./../tokenizeHTMLString");
const tokenizedHTMLArrayToCSV_1 = require("./../tokenizedHTMLArrayToCSV");
function CSVExportDialog(htmlString) {
    dialog.showSaveDialog({
        filters: [
            {
                name: 'comma separated values',
                extensions: ['csv']
            }
        ]
    }, function (fileName) {
        if (fileName === undefined)
            return;
        fs.writeFileSync(fileName, tokenizedHTMLArrayToCSV_1.default(tokenizeHTMLString_1.default(htmlString)));
    });
}
exports.default = CSVExportDialog;
