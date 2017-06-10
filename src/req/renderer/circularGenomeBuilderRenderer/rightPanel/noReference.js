"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr = require("./../../viewMgr");
class NoReference extends viewMgr.View {
    constructor(name, div) {
        super(name, div);
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        return `
            <h3>Select a reference from the left to view coverage visualization options</h3>
        `;
    }
    postRender() { }
    dataChanged() { }
    divClickEvents(event) { }
}
exports.NoReference = NoReference;
function addView(arr, div) {
    arr.push(new NoReference("noReference", div));
}
exports.addView = addView;
