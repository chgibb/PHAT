import * as viewMgr from "./../../viewMgr";
import * as masterView from "./../masterView";
import * as rightPanel from "./../rightPanel";
import {getReadable} from "./../../../getAppPath";

export function renderBLASTRunsTable() : string
{
    let masterView = <masterView.View>viewMgr.getViewByName("masterView");
    let rightPanel = <rightPanel.View>viewMgr.getViewByName("rightPanel",masterView.views);
    if(masterView.displayInfo != "BLASTRuns")
        return "";
    return `
        <img class="activeHover activeHoverButton" id="goBackToAlignments" src="${getReadable("img/GoBack.png")}">
        <table style="width:100%">

        </table>
    `;
}