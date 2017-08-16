/// <reference types="jquery" />
import * as fs from "fs";

import * as viewMgr from "./../viewMgr";
import Fastq from "./../../fastq";
import {getQCReportHTML} from "./../../QCData";

export class ReportView extends viewMgr.View
{
    public fastqToReport : Fastq;
    public constructor(div : string)
    {
        super('report',div);
        this.fastqToReport = undefined;
    }
    onMount(){}
    onUnMount(){}
    renderView()
    {
        if(document.getElementById('reportIsOpen') || !this.fastqToReport)
            return undefined;
        return `
            <div id='gobackbutton' style='padding: 0px 0px 5px 20px'>
                <br />
                <img class="activeHover activeHoverButton" id='goBack' src='img/GoBack.png' >
            </div>
            <div id='reportIsOpen'></div>
            ${(()=>{
                return fs.readFileSync(getQCReportHTML(this.fastqToReport)).toString();
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
            this.fastqToReport = undefined;
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
