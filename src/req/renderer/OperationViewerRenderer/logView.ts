import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as viewMgr from "./../viewMgr";

import {LogRecord,getLogRecords} from "./../../operations/atomicOperations" 

export class View extends viewMgr.View
{
    public logRecords : Array<LogRecord>;
    public recordDepth : number;
    public constructor(div : string)
    {
        super("logView",div);
        this.logRecords = new Array<LogRecord>();
        this.recordDepth = 10;
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
        this.recordDepth = parseInt((<HTMLInputElement>document.getElementById("recordDepth")).value);
        getLogRecords(this.recordDepth).then((records : Array<LogRecord>) => {
            self.logRecords = records
            console.log("got records");
        });
    }
    public divClickEvents(event : JQueryEventObject) : void
    {
        for(let i = 0; i != this.logRecords.length; ++i)
            {
                let classList = event.target.classList;
                if(event.target.classList.contains(`${this.logRecords[i].uuid}Class`))
                {
                    ipc.send(
                        "runOperation",
                        <AtomicOperationIPC>{
                            opName : "openLogViewer",
                            logRecord : this.logRecords[i]
                        }
                    );
                }
            }
    }
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
                    if(this.logRecords.length == 0)
                        res += `<p>Loading...</p>`;
                    for(let i = 0; i != this.logRecords.length; ++i)
                    {
                        res += `
                            <tr class="activeHover ${this.logRecords[i].uuid}Class id="${this.logRecords[i].uuid}Row">
                                <td class="${this.logRecords[i].uuid}Class">${this.logRecords[i].name}</td>
                                <td class="${this.logRecords[i].uuid}Class">${this.logRecords[i].description}</td>
                                <td class="${this.logRecords[i].uuid}Class">${this.logRecords[i].status}</td>
                                <td class="${this.logRecords[i].uuid}Class">${this.logRecords[i].runTime}</td>
                                <td class="${this.logRecords[i].uuid}Class">${new Date(this.logRecords[i].startEpoch)}</td>
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