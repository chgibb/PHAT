console.log("Started GUI test for alignment viewing");
require("./../req/main/main");

import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";

import {openCircularGenomeBuilderWindow} from "./req/circularGenomeBuilder/openCircularGenomeBuilderWindow";
import {toggleFiguresDropdown} from "./req/circularGenomeBuilder/toggleFiguresDropdown";
import {createHPV16Figure} from "./req/circularGenomeBuilder/createHPV16Figure";

import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();

    await openCircularGenomeBuilderWindow();
    await toggleFiguresDropdown();
    await createHPV16Figure();

    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);