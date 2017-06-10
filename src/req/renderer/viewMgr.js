"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class View {
    constructor(name, div, model) {
        this.name = name;
        this.div = div;
        this.data = {};
        this.model = model;
    }
    releaseDivEvents() {
        $('#' + this.div).off();
    }
    reBindDivEvents() {
        var obj = this;
        $('#' + this.div).click(function (event) {
            obj.divClickEvents(event);
        });
    }
    unMount() {
        this.releaseDivEvents();
        this.onUnMount();
    }
    mount() {
        this.reBindDivEvents();
        this.onMount();
    }
    setData(data) {
        this.data = data;
    }
    render() {
        let html = this.renderView();
        if (html) {
            let self = this;
            setTimeout(function () {
                document.getElementById(self.div).innerHTML = html;
                self.postRender();
            }, 0);
        }
    }
}
exports.View = View;
function getIndexOfViewByName(name, targetArr) {
    let arr;
    if (targetArr)
        arr = targetArr;
    else
        arr = module.exports.views;
    for (var i = arr.length - 1; i >= 0; --i) {
        if (arr[i].name == name)
            return i;
    }
    return -1;
}
exports.getIndexOfViewByName = getIndexOfViewByName;
function getViewByName(name, targetArr) {
    let arr;
    if (targetArr)
        arr = targetArr;
    else
        arr = exports.views;
    return arr[getIndexOfViewByName(name, targetArr)];
}
exports.getViewByName = getViewByName;
exports.preRender = null;
exports.postRender = null;
function setPreRender(func) {
    exports.preRender = func;
}
exports.setPreRender = setPreRender;
function render(preRenderArg, postRenderArg, targetArr) {
    let views;
    if (targetArr)
        views = targetArr;
    else
        views = views;
    let currViewRef = getViewByName(exports.currView, views);
    if (!exports.preRender) {
        if (preRenderArg)
            preRenderArg(currViewRef);
    }
    else if (exports.preRender) {
        exports.preRender(currViewRef);
    }
    currViewRef.render();
    if (!exports.postRender) {
        if (postRenderArg)
            postRenderArg(currViewRef);
    }
    else if (exports.postRender) {
        exports.postRender(currViewRef);
    }
}
exports.render = render;
function changeView(newView) {
    let currViewRef = getViewByName(exports.currView);
    let newViewRef = getViewByName(newView);
    if (!newViewRef)
        throw new Error(newView + " is not defined");
    if (currViewRef)
        currViewRef.unMount();
    exports.currView = newView;
    newViewRef.mount();
    module.exports.render();
}
exports.changeView = changeView;
exports.views = new Array();
exports.currView = "";
