/// <reference types="jquery" />
const Dialogs = require("dialogs");
const dialogs = Dialogs();

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
        return `
            <button id="createNewProject">Create New Project</button>
        `;
    }
    public postRender() : void
    {}
    public dataChanged() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {
        if(event.target.id == "createNewProject")
        {
            dialogs.prompt("Project Name","New Project",function(text : string){

            });
        }
    }
}
export function addView(arr : Array<View>,div : string) : void
{
    arr.push(new ProjectsView(div));
}