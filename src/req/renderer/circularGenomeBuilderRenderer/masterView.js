var viewMgr = require('./../viewMgr');

module.exports.addView = function(arr,div,models)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super("masterView",div,models);
                this.view = new Array();
                this.firstRender = true;
            }
            onMount(){}
            onUnMount(){}
            renderView(){}
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}