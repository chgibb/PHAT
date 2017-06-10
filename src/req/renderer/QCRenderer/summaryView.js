"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const ipc = electron.ipcRenderer;
const viewMgr = require("./../viewMgr");
const QCData_1 = require("./../../QCData");
class SummaryView extends viewMgr.View {
    constructor(div) {
        super('summary', div);
        this.fastqInputs = new Array();
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        return `
			<p style='float:right;'>Failure</p><img style='float:right;' src='img/fail.png'>
			<p style='float:right;' >Warning</p><img style='float:right;' src='img/warn.png'>
			<p style='float:right;'>Pass</p><img style='float:right;' src='img/pass.png'>

			<table style='width:100%'>
				<tr>
					<th>Report</th>
					<th>Sample</th>
					<th>Per Base Sequence Quality</th>
					<th>Per Sequence Quality Scores</th>
					<th>Per Sequence GC Content</th>
					<th>Sequence Duplication Levels</th>
					<th>Over Represented Sequences</th>
				</tr>
				${(() => {
            let res = "";
            for (let i = 0; i != this.fastqInputs.length; ++i) {
                if (this.fastqInputs[i].checked) {
                    res += `<tr>`;
                    if (this.fastqInputs[i].QCData.QCReport == "") {
                        res += `<td style='text-align:center;'><b id='${this.fastqInputs[i].uuid}'>click to analyze</b></td>`;
                    }
                    else {
                        res += `
									<td style='text-align:center;'>
										<p>
											<img id='${this.fastqInputs[i].uuid}' src='img/done_Analysis.png' style='text-align:center;'>
											<br/>
											View Report
											</p>
									</td>`;
                    }
                    res += `
								<td>${this.fastqInputs[i].alias}</td>
								<td style='text-align:center;'>
									<img src='img/${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Per base sequence quality")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>
									<img src='img/${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Per sequence quality scores")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>	
									<img src='img/${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Per sequence GC content")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>	
									<img src='img/${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Sequence Duplication Levels")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>	
									<img src='img/${QCData_1.getQCSummaryByNameOfReportByIndex(this.fastqInputs, i, "Overrepresented sequences")}.png' style='text-align:center;'>
								</td>
								</tr>
							`;
                }
            }
            return res;
        })()}
			</table>
		`;
    }
    postRender() { }
    divClickEvents(event) {
        if (!event || !event.target || !event.target.id)
            return;
        for (let i = 0; i != this.fastqInputs.length; ++i) {
            if (this.fastqInputs[i].uuid == event.target.id) {
                if (this.fastqInputs[i].QCData.QCReport == "") {
                    ipc.send("runOperation", {
                        opName: "generateFastQCReport",
                        channel: "input",
                        key: "fastqInputs",
                        uuid: this.fastqInputs[i].uuid
                    });
                }
                else {
                    viewMgr.getViewByName("report").report = this.fastqInputs[i].QCData.QCReport;
                    viewMgr.changeView('report');
                }
            }
        }
    }
    dataChanged() { }
}
exports.SummaryView = SummaryView;
function addView(arr, div) {
    arr.push(new SummaryView(div));
}
exports.addView = addView;
