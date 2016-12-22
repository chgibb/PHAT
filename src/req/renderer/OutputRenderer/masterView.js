var viewMgr = require('./../viewMgr');

var addReportView = require("./reportView");
module.exports.addView = function(arr,div,models)
{
    arr.push
    (
        new class extends viewMgr.View
        {
            constructor()
            {
                super("masterReportView",div,models);
                this.views = new Array();
                this.firstRender = true;
            }
            onMount()
            {
                addReportView.addView(this.views,"report");
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].onMount();
                }
            }
            onUnMount(){}
            renderView()
            {
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].render();
                }
                if(this.firstRender)
                {
                    this.firstRender = false;
                    return;
                }
                
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}