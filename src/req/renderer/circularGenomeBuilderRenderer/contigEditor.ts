/// <reference types="jquery" />
import * as fs from "fs";
import * as util from "util";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./../viewMgr";
import * as cf from "./../circularFigure";
import * as masterView from "./masterView";

export class ContigEditor extends viewMgr.View
{
    public genome : cf.CircularFigure;
    public firstRender : boolean = true;
    public constructor(name : string,div : string)
    {
        super(name,div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public show() : void
    {
        this.mount();
        document.getElementById(this.div).style.display = "block";
    }
    public hide() : void
    {
        this.unMount();
        document.getElementById(this.div).style.display = "none";
    }
    public renderView() : string | undefined
    {
        try
        {
            if(document.getElementById(this.div).style.display == "block")
            {
                return `
                    <div class="modalContent">
                        <div class="modalHeader">
                            <span id="closeEditor" class="modalCloseButton">&times;</span>
                                <h2>Modal Header</h2>
                        </div>
                        <div class="modalBody">
                            <p>Some text in the Modal Body</p>
                            <p>Some other text...</p>
                        </div>
                        <div class="modalFooter">
                            <h3>Modal Footer</h3>
                        </div>
                    </div>
                `;
            }
            else
                return " ";
        }
        catch(err)
        {
            return undefined;
        }
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(event.target.id == "closeEditor")
        {
            this.hide();
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new ContigEditor("contigEditor",div));
}