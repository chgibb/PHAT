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
                    try {
                        input.addFasta(files[i]);
                    }
                    catch (err) {
                        alert("Bowtie2 will reject fasta files with commas in their paths. Please remove all commas from the path and try again.");
                    }
                }
            }
            input.postFastaInputs();
        }
    });
}
exports.default = showFastaBrowseDialog;
