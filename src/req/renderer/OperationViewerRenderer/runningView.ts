import * as viewMgr from "./../viewMgr";
import {AtomicOperation} from "./../../operations/atomicOperations";

export class View extends viewMgr.View
{
    public ops : Array<AtomicOperation<any>>;
    public constructor(div : string)
    {
        super("runningView",div);
        this.ops = new Array<AtomicOperation<any>>();

    }
    public onMount() : void
    {}
    public onUnMount() : void
    {}
    public postRender() : void
    {}
    public dataChanged() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {}
    public renderView() : string
    {
        return `
            <table style="width:100%">
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Message</th>
                </tr>
                ${(()=>
    {
        let res = "";
        if(!this.ops)
            return res;
        for(let i = 0; i != this.ops.length; ++i)
        {
            if(!this.ops[i])
                continue;
            res += `
                            <tr>
                                <td>${this.ops[i].opName}</td>
                                <td>${this.ops[i].running === true ? "Running" : "Queued"}</td>
                                <td></td>
                            
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