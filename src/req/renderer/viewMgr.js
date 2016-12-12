module.exports.View = class
{
    constructor(name,div,model,handlers)
    {
        this.name = name;
        this.div = div;
        this.data = {};
        this.model = model;
        //this.reBindDivEvents();
    }
    releaseDivEvents()
    {
        $('#'+this.div).off();
    }
    reBindDivEvents()
    {
        var obj = this;

        $('#'+this.div).click
        (
            function(event)
            {
                obj.divClickEvents(event);
            }
        );
        //this.onMount();
    }
    unMount()
    {
        this.releaseDivEvents();
        this.onUnMount();
    }
    mount()
    {
        this.reBindDivEvents();
        this.onMount();
    }
    setData(data)
    {
        this.data = data;
    }
    render()
    {
        var html = this.renderView();
        if(html)
        {
            //prevent scrolling of the page on rerender.
            var me = this;
            setTimeout
            (
                function()
                {
                    document.getElementById(me.div).innerHTML = html;
                    me.postRender();
                },0
            );
        }
    }
    onChange(func)
    {
        this.onChangeFunc = func;
    }
    onMount(){}
    onUnMount(){}
    renderView(){}
    postRender(){}
    dataChanged(){}
    divClickEvents(event){}
}

module.exports.getIndexOfViewByName = function(arr,name)
{
    for(var i = arr.length - 1; i >= 0; --i)
    {
        if(arr[i].name == name)
            return i;
    }
}



module.exports.render = function(preRender,postRender)
{
    let currViewRef = module.exports.getIndexOfViewByName(module.exports.views,module.exports.currView);
    if(module.exports.preRender === null)
    {
        if(preRender)
            preRender(currViewRef);
    }
    else if(module.exports.preRender !== null)
    {
        module.exports.preRender(currViewRef);
    }
    currViewRef.render();
    if(module.exports.postRender === null)
    {
        if(postRender)
            postRender(currViewRef);
    }
    else if(module.exports.postRender !== null)
    {
        module.exports.postRender(currViewRef);
    }
}

module.exports.changeView = function(newView)
{
    module.exports.views[module.exports.getIndexOfViewByName(module.exports.views,module.exports.currView)].unMount();
    currView = newView;
    module.exports.views[module.exports.getIndexOfViewByName(module.exports.views,module.exports.currView)].mount();
    render();
}

module.exports.views = new Array();
module.exports.currView = "";
