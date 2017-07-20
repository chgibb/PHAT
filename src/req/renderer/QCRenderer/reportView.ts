/// <reference types="jquery" />
import * as fs from "fs";

import * as viewMgr from "./../viewMgr";

export class ReportView extends viewMgr.View
{
    public report : string;
    public constructor(div : string)
    {
        super('report',div);
        this.report = "";
    }
    onMount(){}
    onUnMount(){}
    renderView()
    {
        if(document.getElementById('reportIsOpen') || !this.report)
            return undefined;
        return `
            <div class="activeHover" id='gobackbutton' style='padding: 0px 0px 5px 20px'>
                <br />
                <img id='goBack' src='img/GoBack.png' >
            </div>
            <div id='reportIsOpen'></div>
            ${(()=>{
                return fs.readFileSync(`${this.report}/fastqc_report.html`).toString();
            })()}
        `;
    }
    postRender(){}
    divClickEvents(event : JQueryEventObject) : void
    {
        if(!event || !event.target || !event.target.id)
            return;
        if(event.target.id == "goBack")
        {
            this.report = "";
            viewMgr.changeView('summary');
            return;
        }
    }
    dataChanged(){}
}

export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new ReportView(div));
}
