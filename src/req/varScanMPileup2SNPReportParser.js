"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function varScanMPileup2SNPReportParser(report) {
    let res = {
        minCoverage: 0,
        minVarFreq: 0,
        minAvgQual: 0,
        pValueThresh: 0,
        SNPsReported: 0,
        indelsReported: 0
    };
    let isMinCoverage = /(Min coverage:)/;
    let isMinVarFreq = /(Min var freq:)/;
    let isMinAvgQual = /(Min avg qual:)/;
    let isPValueThresh = /(P-value thresh:)/;
    let isVariantPositionsReported = /(variant positions reported)/;
    let lines = report.split(/\n/);
    for (let i = 0; i != lines.length; ++i) {
        let tokens;
        if (isMinCoverage.test(lines[i])) {
            tokens = lines[i].split(/\s/);
            res.minCoverage = parseInt(tokens[2]);
            continue;
        }
        if (isMinVarFreq.test(lines[i])) {
            tokens = lines[i].split(/\s/);
            res.minVarFreq = parseFloat(tokens[3]);
            continue;
        }
        if (isMinAvgQual.test(lines[i])) {
            tokens = lines[i].split(/\s/);
            res.minAvgQual = parseInt(tokens[3]);
            continue;
        }
        if (isPValueThresh.test(lines[i])) {
            tokens = lines[i].split(/\s/);
            res.pValueThresh = parseFloat(tokens[2]);
            continue;
        }
        if (isVariantPositionsReported.test(lines[i])) {
            tokens = lines[i].split(/\s/);
            for (let k = 0; k != tokens.length; ++k) {
                if (tokens[k].charAt(0) == "(") {
                    res.SNPsReported = parseInt(tokens[k].substring(1));
                }
                else if (tokens[k].charAt(tokens[k].length - 1) == ")") {
                    res.indelsReported = parseInt(tokens[k - 1]);
                }
            }
            continue;
        }
    }
    return res;
}
exports.varScanMPileup2SNPReportParser = varScanMPileup2SNPReportParser;
