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
        let html = "";
        html += "<div id='gobackbutton' style='padding: 0px 0px 5px 20px'><br /><img id='goBack' src='img/GoBack.png' ></div>";
        //html += "<br /><button id='goBack'>Go Back</button><br/>";
        let report = fs.readFileSync("resources/app/"+this.report+"/fastqc_report.html").toString();
        //add a hidden div that we can test for to determine if a report is open or not.
        report += "<div id='reportIsOpen'></div>";
        html += report;
        return html;
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
