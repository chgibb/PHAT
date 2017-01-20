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
                        <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                        </div>
                        <div id="leftSlideOutPanel" class="leftSlideOutPanel">
                        </div>
                    `;
                }
            }
            postRender(){}
            dataChanged(){}
            divClickEvents(event){}
        }
    );
}