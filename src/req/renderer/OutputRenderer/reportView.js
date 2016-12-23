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
                this.SGCC = false;
                this.SDL = false;
                this.ORS = false;
            }
            onMount(){}
            onUnMount(){}
            renderView()
            {
                var html = new Array();
                html.push
                (
                    "<table style='width:100%'>",
                    "<tr>"
                );
                if(this.alias)
                    html.push("<th>","Alias","</th>");
                if(this.fullName)
                    html.push("<th>","Directory","</th>");
                if(this.sizeInBytes)
                    html.push("<th>","Size In Bytes","</th>");
                if(this.formattedSize)
                    html.push("<th>","Formatted Size","</th>");
                if(this.numberOfSequences)
                    html.push("<th>","Number of Sequences","</th>");
                if(this.PBSQ)
                    html.push("<th>","Per Base Sequence Quality","</th>");
                if(this.PSQS)
                    html.push("<th>","Per Sequence Quality Score","</th>");
                if(this.PSGCC)
                    html.push("<th>","Per Sequence GC Content","</th>");
                if(this.SDL)
                    html.push("<th>","Sequence Duplication Levels","</th>");
                if(this.ORS)
                    html.push("<th>","Over Represented Sequences","</th>");
                html.push("</tr>");
                html.push("</table>");
                return html.join('');
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}