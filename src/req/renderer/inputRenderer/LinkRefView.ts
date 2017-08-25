import * as viewMgr from "./../viewMgr";
import {getReadable} from "./../../getAppPath";
import {Fasta} from "./../../fasta";
import {AlignData} from "./../../alignData";
export class View extends viewMgr.View
{
    public aligns : Array<AlignData>;
    public fastaInputs : Array<Fasta>;
    public constructor(div : string)
    {
        super("linkRefView",div);
        this.aligns = new Array<AlignData>();
        this.fastaInputs = new Array<Fasta>();
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return `

        `;
    }
    public postRender() : void{}
    public divClickEvents(event : JQueryEventObject) : void{}
    public dataChanged() : void{}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}