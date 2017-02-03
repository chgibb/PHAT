/**
 * Functions for managing one or more instances of class View
 * @module req/renderer/viewMgr
 */
module.exports.View = class
{
    /**
     * @param {string} name - Name to assign to view
     * @param {string} div - ID of div to bind view to
     * @param {any} model - Data model object to bind to view
     */
    constructor(name,div,model,handlers)
    {
        this.name = name;
        this.div = div;
        this.data = {};
        this.model = model;
        //this.reBindDivEvents();
    }
    /**
     * Removes event handlers for this view from its div
     */
    releaseDivEvents()
    {
        $('#'+this.div).off();
    }
    /**
     * Adds event handlers for this view to its div
     */
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
    /**
     * Un mount view from its div
     */
    unMount()
    {
        this.releaseDivEvents();
        this.onUnMount();
    }
    /**
     * Mount view to its div
     */
    mount()
    {
        this.reBindDivEvents();
        this.onMount();
    }
    setData(data)
    {
        this.data = data;
    }
    /**
     * Render this view to its div
     */
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
    /**
     * Meant to be overriden. Called during mounting
     */
    onMount(){}
    /**
     * Meant to be overriden. Called during unmounting
     */
    onUnMount(){}
    /**
     * Meant to be overriden. Called during rendering
     * @returns {string} - HTML string to render into div
     */
    renderView(){}
    /**
     * Meant to be overriden. Called after rendering has completed.
     */
    postRender(){}
    /**
     * Meant to be overriden. Called when this view's data has changed
     */
    dataChanged(){}
    /**
     * Meant to be overriden. Called when a user click inside of this view's div
     */
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
    let currViewRef = module.exports.getViewByName(module.exports.currView,module.exports.views);
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
        throw new Error(newView+" is not defined");
    if(currViewRef)
        currViewRef.unMount();
    module.exports.currView = newView;

    
    newViewRef.mount();

    module.exports.render();
}

module.exports.views = new Array();
module.exports.currView = "";
