/**
 * Functions for managing one or more instances of class View
 * @module req/renderer/viewMgr
 */

///// <reference path="jquery.d.ts" />

import {DataModelMgr} from "./model";
export abstract class View
{
    public name : string;
    public div : string;
    public data : any;
    public model : DataModelMgr;
    /**
     * @param {string} name - Name to assign to view
     * @param {string} div - ID of div to bind view to
     * @param {any} model - Data model object to bind to view
     */
    public constructor(name : string,div : string,model : DataModelMgr)
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
    public releaseDivEvents() : void
    {
        $('#'+this.div).off();
    }
    /**
     * Adds event handlers for this view to its div
     */
    public reBindDivEvents() : void
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
    public unMount() : void
    {
        this.releaseDivEvents();
        this.onUnMount();
    }
    /**
     * Mount view to its div
     */
    public mount() : void
    {
        this.reBindDivEvents();
        this.onMount();
    }
    public setData(data : any) : void
    {
        this.data = data;
    }
    /**
     * Render this view to its div
     */
    public render() : void
    {
        let html : string = this.renderView();
        if(html)
        {
            //prevent scrolling of the page on rerender.
            let self = this;
            setTimeout
            (
                function()
                {
                    document.getElementById(self.div).innerHTML = html;
                    self.postRender();
                },0
            );
        }
    }
    /*onChange(func)
    {
        this.onChangeFunc = func;
    }*/
    /**
     * Meant to be overriden. Called during mounting
     */
    public abstract onMount() : void
    /**
     * Meant to be overriden. Called during unmounting
     */
    public abstract onUnMount() : void
    /**
     * Meant to be overriden. Called during rendering
     * @returns {string} - HTML string to render into div
     */
    public abstract renderView() : string
    /**
     * Meant to be overriden. Called after rendering has completed.
     */
    public abstract postRender() : void
    /**
     * Meant to be overriden. Called when this view's data has changed
     */
    public abstract dataChanged() : void
    /**
     * Meant to be overriden. Called when a user click inside of this view's div
     */
    public abstract divClickEvents(event : JQueryEventObject) : void
}

export function getIndexOfViewByName(name : string,targetArr : Array<View>) : number
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
export function getViewByName(name : string,targetArr? : Array<View>) : View
{
    let arr;
    if(targetArr)
        arr = targetArr;
    else
        arr = views;
    return arr[getIndexOfViewByName(name,targetArr)];
}

export let preRender : (view : View) => void = null;
export let postRender : (view : View) => void = null;

export function render(preRenderArg? : (view : View) => void,postRenderArg? : (view : View) => void) : void
{
    let currViewRef = getViewByName(currView,views);
    if(!preRender)
    {
        if(preRenderArg)
            preRenderArg(currViewRef);
    }
    else if(preRender)
    {
        preRender(currViewRef);
    }
    currViewRef.render();
    if(!postRender)
    {
        if(postRenderArg)
            postRenderArg(currViewRef);
    }
    else if(postRender)
    {
        postRender(currViewRef);
    }
}

export function changeView(newView : string) : void
{
    let currViewRef = getViewByName(currView);
    let newViewRef = getViewByName(newView);
    if(!newViewRef)
        throw new Error(newView+" is not defined");
    if(currViewRef)
        currViewRef.unMount();
    currView = newView;

    
    newViewRef.mount();

    module.exports.render();
}

export let views : Array<View> = new Array<View>();
export let currView : string = "";
