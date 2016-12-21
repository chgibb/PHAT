var viewMgr = require('./../viewMgr');
module.exports.addView = function(arr,div,models)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super("masterView",div,models)
            }
            onMount(){}
            onUnMount(){}
            renderView()
            {

            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}