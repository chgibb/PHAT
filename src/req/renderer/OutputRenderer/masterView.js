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
                        
                        <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                            <input type="checkbox" id="alias">Alias</input>
                            <input type="checkbox" id="fullName">Full Path</input>
                            <input type="checkbox" id="sizeInBytes">Size In Bytes</input>
                            <br />
                            <input type="checkbox" id="formattedSize">Formatted Size</input>
                            <input type="checkbox" id="numberOfSequences">Number of Sequences</input>
                            <br />
                            <input type="checkbox" id="PBSQ">Per Base Sequence Quality</input>
                            <br />
                            <input type="checkbox" id="PSQS">Per Sequence Quality Score</input>
                            <br />
                            <input type="checkbox" id="PSGCC">Per Sequence GC Content</input>
                            <br />
                            <input type="checkbox" id="SDL">Sequence Duplication Levels</input>
                            <br />
                            <input type="checkbox" id="ORS">Over Represented Sequences</input>
                        </div>
                        <div id="report">
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
                if(document.getElementById(event.target.id) && 
                   document.getElementById(event.target.id).type == "checkbox")
                {
                     viewMgr.getViewByName("report",this.views)[event.target.id] = $("#"+event.target.id).is(":checked");
                     viewMgr.render();
                }
            }
        }
    );
}