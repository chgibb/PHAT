"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QCData {
    constructor() {
        this.QCReport = "";
        this.summary = new Array();
    }
}
exports.QCData = QCData;
class QCSummary {
    constructor(name, status) {
        if (name)
            this.name = name;
        else
            this.name = "";
        if (status)
            this.status = status;
        else
            this.status = "";
    }
}
exports.QCSummary = QCSummary;
function getQCSummaryByNameOfReportByIndex(fastqInputs, index, summary) {
    let res = "";
    let str = "";
    try {
        for (let i = 0; i != fastqInputs[index].QCData.summary.length; ++i) {
            if (fastqInputs[index].QCData.summary[i].name == summary) {
                return fastqInputs[index].QCData.summary[i].status;
            }
        }
    }
    catch (err) { }
    return "No Data";
}
exports.getQCSummaryByNameOfReportByIndex = getQCSummaryByNameOfReportByIndex;
