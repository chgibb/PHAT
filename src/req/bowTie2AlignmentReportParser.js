"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseBowTie2AlignmentReport(report) {
    let res = {
        reads: 0,
        mates: 0,
        overallAlignmentRate: 0
    };
    let tokens;
    if (report.match(new RegExp("(undefined)", "g")))
        report = report.substring(9, tokens.length);
    tokens = report.split(new RegExp("[ ]|[\n]|[\t]"));
    for (let i = 0; i != tokens.length; i++) {
        if (tokens[i].match(new RegExp("(reads;)", "g"))) {
            res.reads = parseInt(tokens[i - 1]);
        }
        if (tokens[i].match(new RegExp("(mates)", "g"))) {
            res.mates = parseInt(tokens[i - 1]);
        }
        if (tokens[i].match(new RegExp("(overall)", "g"))) {
            res.overallAlignmentRate = parseFloat(tokens[i - 1].substring(0, tokens[i - 1].length - 1));
        }
    }
    return res;
}
exports.parseBowTie2AlignmentReport = parseBowTie2AlignmentReport;
