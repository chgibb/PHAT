"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr = require("./../../viewMgr");
class NoCoverage extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        return `<h3>Run alignments with this reference to generate coverage data to visualize</h3>`;
    }
    postRender() { }
    dataChanged() { }
    divClickEvents(event) { }
}
exports.NoCoverage = NoCoverage;
function addView(arr, div) {
    arr.push(new NoCoverage("noCoverage", div));
}
exports.addView = addView;
