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
                this.views = new Array();
                this.firstRender = true;
                this.leftPanelOpen = false;
                this.rightPanelOpen = false;
                this.fastaInputs = new Array();
            }
            onMount()
            {
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].onMount();
                }
            }
            onUnMount()
            {
                for(let i = 0; i != this.views.length; ++i)
                {
                    this.views[i].onUnMount();
                }
            }
            renderView()
            {
                if(this.firstRender)
                {
                    this.firstRender = false;
                    return `
                        <button id="leftPanel" class="leftSlideOutPanel">Left Panel</button>
                        <button id="rightPanel" class="rightSlideOutPanel">Right Panel</button>
                        <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                        </div>
                        <div id="leftSlideOutPanel" class="leftSlideOutPanel">
                        </div>
                    `;
                }
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event)
            {
                let me = this;
                if(event.target.id == "rightPanel")
                {
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
                if(event.target.id == "leftPanel")
                {
                    $("#leftSlideOutPanel").animate
                    (
                        {
                            "margin-left" : 
                            (
                                function()
                                {
                                    if(!me.leftPanelOpen)
                                    {
                                        me.leftPanelOpen = true;
                                        return "+=50%";
                                    }
                                    if(me.leftPanelOpen)
                                    {
                                        me.leftPanelOpen = false;
                                        return "-=50%";
                                    }
                                }
                            )()
                        }
                    );
                }
            }
        }
    );
}