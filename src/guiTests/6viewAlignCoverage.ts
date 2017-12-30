console.log("Started GUI test for alignment viewing");
require("./../req/main/main");

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";

import {openCircularGenomeBuilderWindow} from "./req/circularGenomeBuilder/openCircularGenomeBuilderWindow";

import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();

    await openCircularGenomeBuilderWindow();

    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);