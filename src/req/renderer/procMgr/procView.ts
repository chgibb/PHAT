import * as viewMgr from "./../viewMgr";
import {PIDInfo} from "./../../PIDInfo";
import trimPath from "./../../trimPath";
import formatByteString from "./../formatByteString";
export class View extends viewMgr.View
{
    public pids : Array<PIDInfo>;
    public constructor(div : string)
    {
        super("procView",div);
        this.pids = new Array<PIDInfo>();
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        this.pids = this.pids.sort(function(a : PIDInfo,b : PIDInfo) : number{
            if(!a.memory || !b.memory)
                return 0;
            return a.memory - b.memory;
        });
        return `
            <div id="procTable" style="width:100%">
                <table style="width:100%;">
                    <tr>
                        <th>Name</th>
                        <th>First Arg</th>
                        <th>CPU %</th>
                        <th>RAM</th>
                    </tr>

                ${(()=>{
                    let res = "";
                    for(let i = 0; i != this.pids.length; ++i)
                    {
                        res += `<tr>`;
                        if(!this.pids[i].isPHAT)
                            res += `<td>${this.pids[i].command ? trimPath(this.pids[i].command) : ""}</td>`;
                        else
                        {
                            res += `<td>phat</td>`;
                        }
                        if(!this.pids[i].isPHAT)
                        {
                            res += `<td>${this.pids[i].arguments[0] ? trimPath(this.pids[i].arguments[0]) : ""}`;
                        }
                        if(this.pids[i].isPHATMain)
                        {
                            res += `<td>main.js</td>`;
                        }
                        if(this.pids[i].isPHATRenderer)
                        {
                            res += `<td>${trimPath(this.pids[i].url)}</td>`;
                        }
                        res += `<td>${this.pids[i].cpu ? this.pids[i].cpu : ""}</th>`;
                        res += `<td>${this.pids[i].memory ? formatByteString(this.pids[i].memory) : ""}</th>`;
                        res += `</tr>`;
                    }
                    return res;
                })()}
                </table>
            </div>
        `;
    }
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}
