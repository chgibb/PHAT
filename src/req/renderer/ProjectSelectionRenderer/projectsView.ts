import {View} from "./../viewMgr";
export class ProjectsView extends View
{
    public constructor(div : string)
    {
        super("projectsView",div);
    }
    public onMount() : void{}
    public onUnMount() : void{}
    public renderView() : string
    {
        return "";
    }
    public postRender() : void
    {}
    public dataChanged() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {}
}
export function addView(arr : Array<View>,div : string) : void
{
    arr.push(new ProjectsView(div));
}