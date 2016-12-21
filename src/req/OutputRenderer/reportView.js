var viewMgr = require('./../viewMgr');

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
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}