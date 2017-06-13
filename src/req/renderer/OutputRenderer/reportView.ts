import * as viewMgr from "./../viewMgr";
import * as masterView from "./masterView";
import * as rightPanel from "./rightPanel";

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
            ${(()=>{
                let res = "";
                if(masterView.displayInfo == "QCInfo")
                {
                    res += `
                        <table style="width:100%">
                        <tr>
                            ${rightPanel.fastQInfoSelection.alias != false ? "<th>Alias</th>" : ""}
                            ${rightPanel.fastQInfoSelection.fullName != false ? "<th>Full Path</th>" : ""}
                            ${rightPanel.fastQInfoSelection.sizeInBytes != false ? "<th>Size In Bytes</th>" : ""}
                            ${rightPanel.fastQInfoSelection.formattedSize != false ? "<th>Formatted Size</th>" : ""}
                            ${rightPanel.fastQInfoSelection.numberOfSequences != false ? "<th>Number of Sequences</th>" : ""}
                            ${rightPanel.fastQInfoSelection.PBSQ != false ? "<th>Per Base Sequence Quality</th>" : ""}
                            ${rightPanel.fastQInfoSelection.PSQS != false ? "<th>Per Sequence Quality Score</th>" : ""}
                            ${rightPanel.fastQInfoSelection.PSGCC != false ? "<th>Per Sequence GC Content</th>" : ""}
                            ${rightPanel.fastQInfoSelection.SDL != false ? "<th>Sequence Duplication Levelsias</th>" : ""}
                            ${rightPanel.fastQInfoSelection.ORS != false ? "<th>Over Represented Sequences</th>" : ""}
                        </tr>

                        </table>
                    `;
                }
                return res;
            })()}
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
