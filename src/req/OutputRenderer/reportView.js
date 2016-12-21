var viewMgr = require('./../viewMgr');

module.exports.alias = false;
module.exports.fullName = false;
module.exports.sizeInBytes = false;
module.exports.formattedSize = false;
module.exports.numberOfSequences = false;
module.exports.PBSQ = false;
module.exports.PSQS = false;
module.exports.SGCC = false;
module.exports.SDL = false;
module.exports.ORS = false;
module.exports.addView = function(arr,div,models)
{
    arr.push
    (
        new class extends viewMgr.view
        {
            constructor()
            {
                super("report",div,models)
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
                if(module.exports.alias)
                    html.push("<th>","Alias","</th>");
                if(module.exports.fullName)
                    html.push("<th>","Directory","</th>");
                if(module.exports.sizeInBytes)
                    html.push("<th>","Size In Bytes","</th>");
                if(module.exports.formattedSize)
                    html.push("<th>","Formatted Size","</th>");
                if(module.exports.numberOfSequences)
                    html.push("<th>","Number of Sequences","</th>");
                if(module.exports.PBSQ)
                    html.push("<th>","Per Base Sequence Quality","</th>");
                if(module.exports.PSQS)
                    html.push("<th>","Per Sequence Quality Score","</th>");
                if(module.exports.PSGCC)
                    html.push("<th>","Per Sequence GC Content","</th>");
                if(module.exports.SDL)
                    html.push("<th>","Sequence Duplication Levels","</th>");
                if(module.exports.ORS)
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