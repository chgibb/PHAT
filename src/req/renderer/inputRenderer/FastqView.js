"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr_1 = require("./../viewMgr");
var buildInclusiveSearchFilter = require('./../buildInclusiveSearchFilter.js');
class FastqView extends viewMgr_1.View {
    constructor(div, model) {
        super('fastq', div, model);
        this.searchFilter = new RegExp("", "i");
        this.filterString = "";
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        if (document.getElementById('fastqInputFilterBox'))
            this.filterString = document.getElementById('fastqInputFilterBox').value;
        var html = new Array();
        html.push("<input id='fastqInputFilterBox' class='inputFilterBox' type='text' autofocus='autofocus' placeholder='Search' />", "<table id='fastqTable' style='width:100%'>", "<tr>", "<td><input type='checkbox' id='fastqSelectAllBox'></input></td>", "<th>Sample Name</th>", "<th>Directory</th>", "<th>Size</th>", "</tr>");
        this.searchFilter = buildInclusiveSearchFilter(this.filterString);
        for (let i = 0; i != this.model.fastqInputs.length; ++i) {
            if (this.searchFilter.test(this.model.fastqInputs[i].alias)) {
                html.push("<tr><td><input type='checkbox' id='", this.model.fastqInputs[i].uuid, "'></input></td>", "<td>", this.model.fastqInputs[i].alias, "</td>", "<td>", this.model.fastqInputs[i].absPath, "</td>", "<td>", this.model.fastqInputs[i].sizeString, "</td>", "</tr>");
            }
        }
        html.push("</table>");
        return html.join('');
    }
    postRender() {
        if (this.filterString)
            document.getElementById('fastqInputFilterBox').value = this.filterString;
        var shouldCheckCheckAllBox = true;
        for (let i = 0; i != this.model.fastqInputs.length; ++i) {
            if (this.model.fastqInputs[i].checked) {
                $('#' + this.model.fastqInputs[i].uuid).prop("checked", true);
            }
            if (this.searchFilter.test(this.model.fastqInputs[i].alias)) {
                if (!this.model.fastqInputs[i].checked)
                    shouldCheckCheckAllBox = false;
            }
        }
        var me = this;
        $('#fastqInputFilterBox').on('change keydown keyup paste', function () {
            me.data.filterString = document.getElementById('fastqInputFilterBox').value;
            me.render();
        });
        $('#fastqSelectAllBox').prop("checked", shouldCheckCheckAllBox);
        document.getElementById('fastqInputFilterBox').focus();
    }
    dataChanged() {
        this.model.postFastqInputs();
    }
    divClickEvents(event) {
        if (!event || !event.target || !event.target.id)
            return;
        if (event.target.id != 'fastqSelectAllBox') {
            if (event.target.checked) {
                for (let i = 0; i != this.model.fastqInputs.length; ++i) {
                    if (this.model.fastqInputs[i].uuid == event.target.id) {
                        this.model.fastqInputs[i].checked = true;
                        this.dataChanged();
                        return;
                    }
                }
            }
            if (!event.target.checked) {
                for (let i = 0; i != this.model.fastqInputs.length; ++i) {
                    if (this.model.fastqInputs[i].uuid == event.target.id) {
                        this.model.fastqInputs[i].checked = false;
                        this.dataChanged();
                        return;
                    }
                }
            }
        }
        if (event.target.id == 'fastqSelectAllBox') {
            this.searchFilter = buildInclusiveSearchFilter(this.filterString);
            for (let i = 0; i != this.model.fastqInputs.length; ++i) {
                if (this.searchFilter.test(this.model.fastqInputs[i].alias)) {
                    this.model.fastqInputs[i].checked = event.target.checked;
                }
            }
            this.dataChanged();
        }
    }
}
exports.FastqView = FastqView;
function addView(arr, div, model) {
    arr.push(new FastqView(div, model));
}
exports.addView = addView;
