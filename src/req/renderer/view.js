module.exports.View = class
{
    constructor(name,div,handlers)
    {
        this.name = name;
        this.div = div;
        this.data = {};
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
                obj.divClickEvents(obj,event);
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
        var html = this.renderView(this);
        if(html)
        {
            //prevent scrolling of the page on rerender.
            var me = this;
            setTimeout
            (
                function()
                {
                    document.getElementById(me.div).innerHTML = html;
                    me.postRender(me);
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
    renderView(parentView){}
    postRender(parentView){}
    dataChanged(){}
    divClickEvents(parentView,event){}
}

module.exports.getIndexOfViewByName = function(arr,name)
{
    for(var i = arr.length - 1; i >= 0; --i)
    {
        if(arr[i].name == name)
            return i;
    }
}