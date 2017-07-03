import * as viewMgr from "./../viewMgr";

import {AtomicOperation} from "./../../operations/atomicOperations"

export class View extends viewMgr.View
{
    public ops : Array<AtomicOperation>;
    public constructor(div : string)
    {
        super("runningView",div);
        this.ops = new Array<AtomicOperation>();

    }
    public onMount() : void{}
    public onUnMount() : void{}
    public postRender() : void{}
    public dataChanged() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
    public renderView() : string
    {
        return `
            <table style="width:100%">
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Message</th>
                </tr>
                ${(()=>{
                    let res = "";
                    if(!this.ops)
                        return res;
                    for(let i = 0; i != this.ops.length; ++i)
                    {
                        if(!this.ops[i])
                            continue;
                        res += `
                            <tr>
                                <td>${this.ops[i].name}</td>
                                <td>${this.ops[i].running != false ? "Running" : "Queued"}</td>
                                <td>${(()=>{
                                    if(this.ops[i].progressMessage)
                                        return this.ops[i].progressMessage
                                    if(this.ops[i].extraData)
                                        return this.ops[i].extraData
                                    return "";
                                })()}</td>
                            
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