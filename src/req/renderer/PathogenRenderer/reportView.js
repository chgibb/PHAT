"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr = require("./../viewMgr");
class ReportView extends viewMgr.View {
    constructor(div) {
        super('report', div);
        this.selectedFastaInputs = new Array();
        this.selectedFastqInputs = new Array();
        this.aligns = new Array();
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        return `
            <table style='width:100%'>
                <tr>
                    <th>Name</th>
                    <th>Reads</th>
                    <th>Mates</th>
                    <th>Overall Alignment Rate %</th>
                    <th>Date Ran</th>
                </tr>
                ${(() => {
            let res = "";
            for (let i = 0; i != this.aligns.length; ++i) {
                if (this.aligns[i].type = "path") {
                    let found = 0;
                    for (let k = 0; k != this.selectedFastaInputs.length; ++k) {
                        if (this.selectedFastaInputs[k].uuid == this.aligns[i].fasta.uuid) {
                            found++;
                            break;
                        }
                    }
                    if (found == 1) {
                        for (let k = 0; k != this.selectedFastqInputs.length; ++k) {
                            if (this.selectedFastqInputs[k].uuid == this.aligns[i].fastqs[0].uuid) {
                                found++;
                                continue;
                            }
                            if (this.selectedFastqInputs[k].uuid == this.aligns[i].fastqs[1].uuid) {
                                found++;
                                continue;
                            }
                        }
                    }
                    if (found == 3) {
                        res += `
                                    <tr>
                                        <td><p id="${this.aligns[i].uuid}">${this.aligns[i].alias}</i></td>
                                        <td>${this.aligns[i].summary.reads}</td>
                                        <td>${this.aligns[i].summary.mates}</td>
                                        <td>${this.aligns[i].summary.overallAlignmentRate}</td>
                                        <td>${this.aligns[i].dateStampString}</td>
                                    </tr>
                                `;
                    }
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
        for (let i = 0; i != this.aligns.length; ++i) {
            if (this.aligns[i].uuid == event.target.id) {
                if (this.aligns[i].summary.overallAlignmentRate != 0) {
                    viewMgr.getViewByName("pileUp").report = this.aligns[i].uuid;
                    viewMgr.changeView("pileUp");
                    return;
                }
                else {
                    alert(`Can't view an alignment with 0% alignment rate`);
                    return;
                }
            }
        }
    }
    dataChanged() { }
}
exports.ReportView = ReportView;
function addView(arr, div) {
    arr.push(new ReportView(div));
}
exports.addView = addView;
