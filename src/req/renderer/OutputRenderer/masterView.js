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
                if(this.firstRender)
                {
                    this.firstRender = false;
                    return `
                        <div id="report">
                        </div>
                        <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                    `;
                }
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].render();
                }
                
                
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}