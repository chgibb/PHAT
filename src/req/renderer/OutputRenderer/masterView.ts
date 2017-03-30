import * as viewMgr from "./../viewMgr";
import {DataModelMgr} from "./../model";
import * as reportView from "./reportView";

import XLSExportDialog from "./XLSExportDialog";
import CSVExportDialog from "./CSVExportDialog";
export class MasterView extends viewMgr.View
{
    public views : Array<viewMgr.View>;
    public firstRender : boolean;
    public rightPanelOpen : boolean;
    public constructor(div : string,model? : DataModelMgr)
    {
        super("masterReportView",div,model);
        this.views = new Array<viewMgr.View>();
        this.firstRender = true;
        this.rightPanelOpen = false;
    }
    onMount()
    { 
        reportView.addView(this.views,"report");
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].onMount();
        }
    }
    onUnMount(){}
    renderView()
    {
        if(this.firstRender)
        {
            this.firstRender = false;
            return `
                <button id="optionsButton" class="optionsButton">Options</button>
                        
                <div id="rightSlideOutPanel" class="rightSlideOutPanel">
                    <input type="checkbox" id="alias">Alias</input>
                    <input type="checkbox" id="fullName">Full Path</input>
                    <input type="checkbox" id="sizeInBytes">Size In Bytes</input>
                    <br />
                    <input type="checkbox" id="formattedSize">Formatted Size</input>
                    <input type="checkbox" id="numberOfSequences">Number of Sequences</input>
                    <br />
                    <input type="checkbox" id="PBSQ">Per Base Sequence Quality</input>
                    <br />
                    <input type="checkbox" id="PSQS">Per Sequence Quality Score</input>
                    <br />
                    <input type="checkbox" id="PSGCC">Per Sequence GC Content</input>
                    <br />
                    <input type="checkbox" id="SDL">Sequence Duplication Levels</input>
                    <br />
                    <input type="checkbox" id="ORS">Over Represented Sequences</input>
                    <br />
                    <p>Export To:</p>
			        <input type="radio" name="exportOptions" id="exportToXLS">Excel</input>
			        <input type="radio" name="exportOptions" id="exportToCSV">CSV</input>
			        <button id="exportData">Export</button>
                </div>
                <div id="report">
                </div>
            `;
        }
        for(let i = 0; i != this.views.length; ++i)
        {
            this.views[i].render();
        }
        return undefined;
    }
    postRender(){}
    dataChanged(){}
    divClickEvents(event : JQueryEventObject)
    {
        if(!event || !event.target || !event.target.id)
            return;
        if(event.target.id == "optionsButton")
        {
            let me = this;
            $("#rightSlideOutPanel").animate
            (
                {
                    "margin-right" : 
                    (
                        function()
                        {
                            me.rightPanelOpen = !me.rightPanelOpen;
                            return (me.rightPanelOpen == true ? "+" : "-")+"=50%";
                        }
                    )()
                }
            );
        }
        if(document.getElementById(event.target.id) && 
            (<HTMLInputElement>document.getElementById(event.target.id)).type == "checkbox")
        {
            (<any>viewMgr.getViewByName("report",this.views))[event.target.id] = $("#"+event.target.id).is(":checked");
            viewMgr.render();
        }
        if(event.target.id == "exportData")
        {
            if($("#exportToXLS").is(":checked"))
            {
                XLSExportDialog(viewMgr.getViewByName("report",this.views).renderView());
            }

            if($("#exportToCSV").is(":checked"))
            {
                CSVExportDialog(viewMgr.getViewByName("report", this.views).renderView());
            }
        }
    }
}

export function addView(arr : Array<viewMgr.View>,div : string,model? : DataModelMgr) : void
{
    arr.push(new MasterView(div,model));
}