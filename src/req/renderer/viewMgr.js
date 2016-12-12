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

module.exports.getIndexOfViewByName = function(name,targetArr)
{
    let arr;
    if(targetArr)
        arr = targetArr;
    else
        arr = module.exports.views;
    for(var i = arr.length - 1; i >= 0; --i)
    {
        if(arr[i].name == name)
            return i;
    }
}
module.exports.getViewByName = function(name,targetArr)
{
    let arr;
    if(targetArr)
        arr = targetArr;
    else
        arr = module.exports.views;
    return arr[module.exports.getIndexOfViewByName(name,targetArr)];
}



module.exports.render = function(preRender,postRender)
{
    let currViewRef = module.exports.getViewByName(module.exports.views,module.exports.currView);
    if(!module.exports.preRender)
    {
        if(preRender)
            preRender(currViewRef);
    }
    else if(module.exports.preRender)
    {
        module.exports.preRender(currViewRef);
    }
    currViewRef.render();
    if(!module.exports.postRender)
    {
        if(postRender)
            postRender(currViewRef);
    }
    else if(module.exports.postRender)
    {
        module.exports.postRender(currViewRef);
    }
}

module.exports.changeView = function(newView)
{
    let currViewRef = module.exports.getViewByName(module.exports.currView);
    let newViewRef = module.exports.getViewByName(newView);
    if(!newViewRef)
        throw new Error(newView+"is not defined");
    if(currViewRef)
        currViewRef.unMount();
    module.exports.currView = newView;

    
    newViewRef.mount();

    module.exports.render();
}

module.exports.views = new Array();
module.exports.currView = "";
