/// <reference types="jquery" />
import * as fs from "fs";
import * as util from "util";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

const Dialogs = require("dialogs");
const dialogs = Dialogs();

import * as viewMgr from "./../viewMgr";
import * as cf from "./../circularFigure";
import * as masterView from "./masterView";
import {GenomeView} from "./genomeView";

export class ContigCreator extends viewMgr.View
{
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
        document.getElementById(this.div).style.display = "none";
        this.unMount();
    }
    public renderView() : string | undefined
    {
        try
        {
            return `
                <div class="modalContent">
                    <div class="modalHeader">
                        <span id="closeCreator" class="modalCloseButton">&times;</span>
                        <h2 id="contigAlias" style="display:inline-block;">${"a"}</h2>
                    </div>
                    <div class="modalBody">
                    </div>
                    <div class="modalFooter">
                    </div>
                </div>
            `;
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
        if(event.target.id == "closeCreator")
        {
            this.hide();
        }
    }
}
export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new ContigCreator("contigCreator",div));
}