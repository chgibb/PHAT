"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const dialog = electron.remote.dialog;
function showFastqBrowseDialog(input) {
    dialog.showOpenDialog({
        title: "Select Fastq Data",
        filters: [
            {
                name: 'FastQ Data',
                extensions: [
                    'fastq',
                    'fq'
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
                if (!input.fastqExists(files[i])) {
                    input.addFastq(files[i]);
                }
            }
            input.postFastqInputs();
        }
    });
}
exports.default = showFastqBrowseDialog;
