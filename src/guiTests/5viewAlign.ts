console.log("Started GUI test for alignment viewing");
require("./../req/main/main");

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openOutputWindow} from "./req/output/openOutputWindow";
import {openOptionsPanel} from "./req/output/openOptionsPanel";

import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();
    await openOutputWindow();
    await openOptionsPanel();

    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);