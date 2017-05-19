"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const dialog = electron.remote.dialog;
function showFastaBrowseDialog(input) {
    dialog.showOpenDialog({
        title: "Select Fasta Data",
        filters: [
            {
                name: 'Fasta Data',
                extensions: [
                    'fasta',
                    'fa'
                ]
            }
        ],
        properties: [
            "openFile",
            "multiSelections"
        ]
    }, function (files) {
        if (files) {
            for (let i = 0; i != files.length; ++i) {
                if (!input.fastaExists(files[i])) {
                    input.addFasta(files[i]);
                }
            }
            input.postFastaInputs();
        }
    });
}
exports.default = showFastaBrowseDialog;
