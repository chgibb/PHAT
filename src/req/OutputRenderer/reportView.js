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

                html.push("</table>");
                return html.join('');
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}