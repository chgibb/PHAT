var viewMgr = require('./../viewMgr');
let CircularGenomeWriter = require("./../circularGenome/circularGenomeWriter");
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

                this.genomeWriters = new Array();
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
            loadedContig()
            {
                alert("done loading "+JSON.stringify(this.genomeWriters[this.genomeWriters.length - 1],undefined,4));
            }
            divClickEvents(event)
            {
                var me = this;
                if(event.target.id == "rightPanel")
                {
                    this.genomeWriters.push(new CircularGenomeWriter());
                    this.genomeWriters[this.genomeWriters.length - 1].on
                    (
                        "doneLoadingContigs",function()
                        {
                            me.loadedContig();
                        }
                    );
                    this.genomeWriters[this.genomeWriters.length - 1].beginRefStream(this.fastaInputs[0].name);
                
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