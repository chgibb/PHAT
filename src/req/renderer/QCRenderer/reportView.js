"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const viewMgr = require("./../viewMgr");
class ReportView extends viewMgr.View {
    constructor(div) {
        super('report', div);
        this.report = "";
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        if (document.getElementById('reportIsOpen') || !this.report)
            return undefined;
        return `
            <div id='gobackbutton' style='padding: 0px 0px 5px 20px'>
                <br />
                <img id='goBack' src='img/GoBack.png' >
            </div>
            <div id='reportIsOpen'></div>
            ${(() => {
            return fs.readFileSync(`${this.report}/fastqc_report.html`).toString();
        })()}
        `;
    }
    postRender() { }
    divClickEvents(event) {
        if (!event || !event.target || !event.target.id)
            return;
        if (event.target.id == "goBack") {
            this.report = "";
            viewMgr.changeView('summary');
            return;
        }
    }
    dataChanged() { }
}
exports.ReportView = ReportView;
function addView(arr, div) {
    arr.push(new ReportView(div));
}
exports.addView = addView;
