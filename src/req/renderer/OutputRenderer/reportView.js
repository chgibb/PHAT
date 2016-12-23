var viewMgr = require('./../viewMgr');

module.exports.addView = function(arr,div,models)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super("report",div,models);
                this.alias = false;
                this.fullName = false;
                this.sizeInBytes = false;
                this.formattedSize = false;
                this.numberOfSequences = false;
                this.PBSQ = false;
                this.PSQS = false;
                this.PSGCC = false;
                this.SDL = false;
                this.ORS = false;
            }
            onMount(){}
            onUnMount(){}
            renderView()
            {
                return `
                    <table style='width:100%'>
                    <tr>
                        ${this.alias != false ? "<th>Alias</th>" : ""}
                        ${this.fullName != false ? "<th>Directory</th>" : ""}
                        ${this.sizeInBytes != false ? "<th>Size In Bytes</th>" : ""}
                        ${this.formattedSize != false ? "<th>Formatted Size</th>" : ""}
                        ${this.numberOfSequences != false ? "<th>Number of Sequences</th>" : ""}
                        ${this.PBSQ != false ? "<th>Per Base Sequence Quality</th>" : ""}
                        ${this.PSQS != false ? "<th>Per Sequence Quality Score</th>" : ""}
                        ${this.PSGCC != false ? "<th>Per Sequence GC Content</th>" : ""}
                        ${this.SDL != false ? "<th>Sequence Duplication Levels</th>" : ""}
                        ${this.ORS != false ? "<th>Over Represented Sequences</th>" : ""}
                    </tr>
                    </table>
                `;
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}