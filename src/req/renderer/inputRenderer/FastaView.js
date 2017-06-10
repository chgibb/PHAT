"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewMgr_1 = require("./../viewMgr");
var buildInclusiveSearchFilter = require('./../buildInclusiveSearchFilter.js');
class FastaView extends viewMgr_1.View {
    constructor(div, model) {
        super('fasta', div, model);
        this.searchFilter = new RegExp("", "i");
        this.filterString = "";
    }
    onMount() { }
    onUnMount() { }
    renderView() {
        if (document.getElementById('fastaInputFilterBox'))
            this.filterString = document.getElementById('fastaInputFilterBox').value;
        var html = new Array();
        html.push("<img src='img/indexButton.png' style='margin:0px 18px 18px 18px;' class='viewTab' id='indexButton'>", "<input id='fastaInputFilterBox' style='margin-left:-400px;' class='inputFilterBox' type='text' autofocus='autofocus' placeholder='Search' />", "<table style='width:100%'>", "<tr>", "<td><input type='checkbox' id='fastaSelectAllBox'></input></td>", "<th>Reference Name</th>", "<th>Directory</th>", "<th>Size</th>", "<th>Pathogen</th>", "<th>Host</th>", "<th>Indexed</th>", "</tr>");
        this.searchFilter = buildInclusiveSearchFilter(this.filterString);
        for (let i = 0; i != this.model.fastaInputs.length; ++i) {
            if (this.searchFilter.test(this.model.fastaInputs[i].alias)) {
                html.push("<tr><td><input type='checkbox' id='", this.model.fastaInputs[i].uuid, "'></input></td>", "<td id='", this.model.fastaInputs[i].uuid + "_p", "'>", this.model.fastaInputs[i].alias, "</td>", "<td>", this.model.fastaInputs[i].absPath, "</td>", "<td>", this.model.fastaInputs[i].sizeString, "</td>", "<td>", "<input type='radio' id='", this.model.fastaInputs[i].uuid + "_path", "' name='", this.model.fastaInputs[i].uuid, "'></input></td>", "<td>", "<input type='radio' id='", this.model.fastaInputs[i].uuid + "_host", "' name='", this.model.fastaInputs[i].uuid, "'></input></td>", "<td>", this.model.fastaInputs[i].indexed, "</td>", "</tr>");
            }
        }
        html.push("</table>");
        return html.join('');
    }
    postRender() {
        if (this.filterString)
            document.getElementById('fastaInputFilterBox').value = this.filterString;
        var shouldCheckCheckAllBox = true;
        for (let i = 0; i != this.model.fastaInputs.length; ++i) {
            if (this.model.fastaInputs[i].checked) {
                $('#' + this.model.fastaInputs[i].uuid).prop("checked", true);
            }
            if (this.model.fastaInputs[i].host)
                $('#' + this.model.fastaInputs[i].uuid + '_host').prop("checked", true);
            if (this.model.fastaInputs[i].pathogen)
                $('#' + this.model.fastaInputs[i].uuid + '_path').prop("checked", true);
            if (this.searchFilter.test(this.model.fastaInputs[i].alias)) {
                if (!this.model.fastaInputs[i].checked)
                    shouldCheckCheckAllBox = false;
            }
        }
        var me = this;
        $('#fastaInputFilterBox').on('change keydown keyup paste', function () {
            me.data.filterString = document.getElementById('fastaInputFilterBox').value;
            me.render();
        });
        $('#fastaSelectAllBox').prop("checked", shouldCheckCheckAllBox);
        document.getElementById('fastaInputFilterBox').focus();
    }
    divClickEvents(event) {
        if (!event || !event.target || !event.target.id)
            return;
        if (event.target.id != 'fastaSelectAllBox') {
            if (event.target.checked) {
                for (let i = 0; i != this.model.fastaInputs.length; ++i) {
                    if (this.model.fastaInputs[i].uuid == event.target.id) {
                        this.model.fastaInputs[i].checked = true;
                        this.dataChanged();
                        return;
                    }
                }
            }
            if (!event.target.checked) {
                for (let i = 0; i != this.model.fastaInputs.length; ++i) {
                    if (this.model.fastaInputs[i].uuid == event.target.id) {
                        this.model.fastaInputs[i].checked = false;
                        this.dataChanged();
                        return;
                    }
                }
            }
        }
        if (event.target.id == 'fastaSelectAllBox') {
            this.searchFilter = buildInclusiveSearchFilter(this.filterString);
            for (let i = 0; i != this.model.fastaInputs.length; ++i) {
                if (this.searchFilter.test(this.model.fastaInputs[i].alias)) {
                    this.model.fastaInputs[i].checked = event.target.checked;
                }
            }
            this.dataChanged();
            return;
        }
        if (event.target.id == 'indexButton') {
            this.searchFilter = buildInclusiveSearchFilter(this.filterString);
            for (let i = 0; i != this.model.fastaInputs.length; ++i) {
                if (this.searchFilter.test(this.model.fastaInputs[i].alias)) {
                    if (this.model.fastaInputs[i].checked)
                        this.model.indexFasta(this.model.fastaInputs[i]);
                }
            }
        }
        var type = event.target.id.substr(event.target.id.length - 5, event.target.id.length);
        if (type == "_host" || type == "_path" && event.target.checked) {
            console.log('identified radio');
            var ID = event.target.id.substr(0, event.target.id.length - 5);
            for (let i = 0; i != this.model.fastaInputs.length; ++i) {
                if (this.model.fastaInputs[i].uuid == ID) {
                    if (type == "_host") {
                        this.model.fastaInputs[i].host = true;
                        this.model.fastaInputs[i].pathogen = false;
                        this.model.fastaInputs[i].type = "host";
                        this.dataChanged();
                        return;
                    }
                    if (type == "_path") {
                        this.model.fastaInputs[i].host = false;
                        this.model.fastaInputs[i].pathogen = true;
                        this.model.fastaInputs[i].type = "path";
                        this.dataChanged();
                        return;
                    }
                }
            }
        }
    }
    dataChanged() {
        this.model.postFastaInputs();
    }
}
exports.FastaView = FastaView;
function addView(arr, div, model) {
    arr.push(new FastaView(div, model));
}
exports.addView = addView;
