"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr = require("./../../viewMgr");
class SelectAlignment extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        let masterView = viewMgr.getViewByName("masterView");
        let rightPanelView = viewMgr.getViewByName("rightPanel", masterView.views);
        let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
        this.genome = genomeView.genome;
        this.alignData = rightPanelView.alignData;
        return ` 
            <h1>Coverage Options</h1>
            ${(() => {
            let res = `
                    <table style='width:100%'>
                        <tr>
                            <th>Options</th>
                            <th>Name</th>
                            <th>Reads</th>
                            <th>Mates</th>
                            <th>Overall Alignment Rate %</th>
                            <th>Date Ran</th>
                        </tr>
                `;
            if (this.alignData) {
                for (let i = 0; i != this.alignData.length; ++i) {
                    if (this.alignData[i].fasta.uuid == this.genome.uuidFasta) {
                        let viewing = 0;
                        for (let k = 0; k != this.genome.renderedCoverageTracks.length; ++k) {
                            if (this.genome.renderedCoverageTracks[k].uuidAlign == this.alignData[i].uuid && this.genome.renderedCoverageTracks[k].checked)
                                viewing++;
                        }
                        res += `
                                <tr>
                                    <td><button id="${this.alignData[i].uuid}">View Available Tracks</button><br />
                                    ${viewing > 0 ? `Showing ${viewing} ${viewing > 1 ? "Tracks" : "Track"} from this alignment` : ``}</td>
                                    <td>${this.alignData[i].alias}</td>
                                    <td>${this.alignData[i].summary.reads}</td>
                                    <td>${this.alignData[i].summary.mates}</td>
                                    <td>${this.alignData[i].summary.overallAlignmentRate}</td>
                                    <td>${this.alignData[i].dateStampString}</td>
                                </tr>
                            `;
                    }
                }
            }
            res += `</table>`;
            return res;
        })()}
        `;
    }
    postRender() {
        let masterView = viewMgr.getViewByName("masterView");
        let rightPanel = viewMgr.getViewByName("rightPanel", masterView.views);
        if (rightPanel.selectedAlignment) {
            document.getElementById(rightPanel.selectedAlignment.uuid).checked = true;
        }
    }
    dataChanged() { }
    divClickEvents(event) {
        if (event.target.id) {
            for (let i = 0; i != this.alignData.length; ++i) {
                if (event.target.id == this.alignData[i].uuid) {
                    let masterView = viewMgr.getViewByName("masterView");
                    let rightPanel = viewMgr.getViewByName("rightPanel", masterView.views);
                    rightPanel.selectedAlignment = this.alignData[i];
                    viewMgr.render();
                }
            }
        }
    }
}
exports.SelectAlignment = SelectAlignment;
function addView(arr, div) {
    arr.push(new SelectAlignment("selectAlignment", div));
}
exports.addView = addView;
