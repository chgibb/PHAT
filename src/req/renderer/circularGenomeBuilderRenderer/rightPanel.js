"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr = require("./../viewMgr");
const selectAlignment = require("./rightPanel/selectAlignment");
const selectCoverageTracks = require("./rightPanel/selectCoverageTracks");
const noReference = require("./rightPanel/noReference");
const noCoverage = require("./rightPanel/noCoverage");
class RightPanel extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
        this.views = new Array();
        selectAlignment.addView(this.views, this.div + "View");
        selectCoverageTracks.addView(this.views, this.div + "View");
        noReference.addView(this.views, this.div + "View");
        noCoverage.addView(this.views, this.div) + "View";
    }
    unMountChildren() {
        for (let i = 0; i != this.views.length; ++i) {
            this.views[i].unMount();
        }
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        this.unMountChildren();
        let masterView = viewMgr.getViewByName("masterView");
        let genomeView = viewMgr.getViewByName("genomeView", masterView.views);
        let idx = -1;
        if (!genomeView.genome)
            idx = viewMgr.getIndexOfViewByName("noReference", this.views);
        else if (!this.alignData)
            idx = viewMgr.getIndexOfViewByName("noCoverage", this.views);
        else if (this.alignData) {
            idx = viewMgr.getIndexOfViewByName("selectAlignment", this.views);
            this.views[idx].alignData = this.alignData;
        }
        if (this.selectedAlignment) {
            idx = viewMgr.getIndexOfViewByName("selectCoverageTracks", this.views);
        }
        this.views[idx].mount();
        this.views[idx].render();
        return undefined;
    }
    postRender() { }
    dataChanged() { }
    divClickEvents(event) { }
}
exports.RightPanel = RightPanel;
function addView(arr, div) {
    arr.push(new RightPanel("rightPanel", div));
}
exports.addView = addView;
