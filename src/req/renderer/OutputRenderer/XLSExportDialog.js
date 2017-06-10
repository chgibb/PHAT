"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const dialog = electron.remote.dialog;
const fs = require("fs");
const tokenizeHTMLString_1 = require("./../tokenizeHTMLString");
const tokenizedHTMLArrayToXLS_1 = require("./../tokenizedHTMLArrayToXLS");
function XLSExportDialog(htmlString) {
    dialog.showSaveDialog({
        filters: [
            {
                name: 'Spread Sheet',
                extensions: ['xls']
            }
        ]
    }, function (fileName) {
        if (fileName === undefined)
            return;
        fs.writeFileSync(fileName, tokenizedHTMLArrayToXLS_1.default(tokenizeHTMLString_1.default(htmlString)));
    });
}
exports.default = XLSExportDialog;
