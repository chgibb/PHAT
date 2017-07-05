import * as viewMgr from "./../viewMgr";

import {LogRecord,getLogRecords} from "./../../operations/atomicOperations" 

export class View extends viewMgr.View
{
    public logRecords : Array<LogRecord>;
    public constructor(div : string)
    {
        super("logView",div);
        this.logRecords = new Array<LogRecord>();
    }
    public onMount() : void
    {
        this.dataChanged();
    }
    public onUnMount() : void{}
    public postRender() : void{}
    public dataChanged() : void
    {
        let self = this;
        console.log("fetching log records");
        getLogRecords(10).then((records : Array<LogRecord>) => {
            self.logRecords = records
            console.log("got records");
        });
    }
    public divClickEvents(event : JQueryEventObject) : void{}
    public renderView() : string
    {
        return `
            <table style="width:100%">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Runtime (ms)</th>
                    <th>Time Started</th>
                </tr>
                ${(()=>{
                    let res = "";
                    for(let i = 0; i != this.logRecords.length; ++i)
                    {
                        res += `
                            <tr>
                                <td>${this.logRecords[i].name}</td>
                                <td>${this.logRecords[i].description}</td>
                                <td>${this.logRecords[i].status}</td>
                                <td>${this.logRecords[i].runTime}</td>
                                <td>${new Date(this.logRecords[i].startEpoch)}</td>
                            </tr>
                        `;
                    }
                    return res;
                })()}

            </table>
        `;
    }
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}