import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as rightPanel from "./rightPanel";

import {getQCSummaryByNameOfReportByIndex} from "./../../QCData"

import {renderQCReportTable} from "./reportView/renderQCReportTable";
import {renderAlignmentReportTable} from "./reportView/renderAlignmentReportTable";

export function addView(arr : Array<viewMgr.View>,div : string)
{
    arr.push(new View(div));
}
export class View extends viewMgr.View
{
    public constructor(div : string)
    {
        super("reportView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        let masterView = <masterView.View>viewMgr.getViewByName("masterView");
        let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
        return `
            ${renderQCReportTable()}
            ${renderAlignmentReportTable()}

        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
