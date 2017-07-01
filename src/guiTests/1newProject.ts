console.log("Started GUI test for New Project");
require("./../req/main/main");

import * as winMgr from "./../req/main/winMgr";
import {createNewProject} from "./req/projectSelection/createNewProject";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await createNewProject();
    await openProjectsView();
    await openFirstProject();
    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);
