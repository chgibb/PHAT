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
                this.righPanelOpen = false;
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
                        <button id="optionsButton" class="optionsButton">Options</button>
                        <div id="report">
                        </div>
                        <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                            <input type="checkbox" id="fullName">Full Path</input>
                        </div>
                    `;
                }
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].render();
                }
                
                
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event)
            {
                if(!event || !event.target || !event.target.id)
                    return;
                if(event.target.id == "optionsButton")
                {
                    let me = this;
                    $("#rightSlideOutPanel").animate
                    (
                        {
                            "margin-right" : 
                            (
                                function()
                                {
                                    if(!me.rightPanelOpen)
                                    {
                                        me.rightPanelOpen = true;
                                        return "+=50%";
                                    }
                                    if(me.rightPanelOpen)
                                    {
                                        me.rightPanelOpen = false;
                                        return "-=50%";
                                    }
                                }
                            )()
                        }
                    );
                }
                if(event.target.id == "fullName")
                {
                    viewMgr.getViewByName("report",this.views).fullName = true;
                    viewMgr.render();
                }
            }
        }
    );
}