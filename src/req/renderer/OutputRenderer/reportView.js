"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr = require("./../viewMgr");
const QCData_1 = require("./../../QCData");
class ReportView extends viewMgr.View {
    constructor(div, model) {
        super("report", div, model);
        this.alias = false;
        this.fullName = false;
        this.sizeInBytes = false;
        this.formattedSize = false;
        this.numberOfSequences = false;
        this.PBSQ = false;
        this.PSQS = false;
        this.PSGCC = false;
        this.SDL = false;
        this.ORS = false;
        this.fastqInputs = new Array();
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        return `
            <table style='width:100%'>
                <tr>
                    ${this.alias != false ? "<th>Alias</th>" : ""}
                    ${this.fullName != false ? "<th>Full Path</th>" : ""}
                    ${this.sizeInBytes != false ? "<th>Size In Bytes</th>" : ""}
                    ${this.formattedSize != false ? "<th>Formatted Size</th>" : ""}
                    ${this.numberOfSequences != false ? "<th>Number of Sequences</th>" : ""}
                    ${this.PBSQ != false ? "<th>Per Base Sequence Quality</th>" : ""}
                    ${this.PSQS != false ? "<th>Per Sequence Quality Score</th>" : ""}
                    ${this.PSGCC != false ? "<th>Per Sequence GC Content</th>" : ""}
                    ${this.SDL != false ? "<th>Sequence Duplication Levels</th>" : ""}
                    ${this.ORS != false ? "<th>Over Represented Sequences</th>" : ""}
                </tr>
                ${(() => {
            let res = "";
            for (let i = 0; i != this.fastqInputs.length; ++i) {
                if (this.fastqInputs[i].checked) {
                    res += "<tr>";
                    if (this.alias)
                        res += `<td>${this.fastqInputs[i].alias}</td>`;
                    if (this.fullName)
                        res += `<td>${this.fastqInputs[i].absPath}</td>`;
                    if (this.sizeInBytes)
                        res += `<td>${this.fastqInputs[i].size}</td>`;
                    if (this.formattedSize)
                        res += `<td>${this.fastqInputs[i].sizeString}</td>`;
                    if (this.numberOfSequences)
                        res += `<td>${this.fastqInputs[i].sequences}</td>`;
                    if (this.PBSQ)
                        res += `<td>${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Per base sequence quality")}</td>`;
                    if (this.PSQS)
                        res += `<td>${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Per sequence quality scores")}</td>`;
                    if (this.PSGCC)
                        res += `<td>${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Per sequence GC content")}</td>`;
                    if (this.SDL)
                        res += `<td>${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Sequence Duplication Levels")}</td>`;
                    if (this.ORS)
                        res += `<td>${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Overrepresented sequences")}</td>`;
                    res += "</tr>";
                }
            }
            return res;
        })()}
            </table>
        `;
    }
    postRender() { }
    dataChanged() { }
    divClickEvents(event) { }
}
exports.ReportView = ReportView;
function addView(arr, div, model) {
    arr.push(new ReportView(div, model));
}
exports.addView = addView;
