console.log("Started GUI test for alignment viewing");
require("./../req/main/main");
import {logMainProcessErrors} from "./req/logMainProcessErrors";
logMainProcessErrors();
import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openCircularGenomeBuilderWindow} from "./req/circularGenomeBuilder/openCircularGenomeBuilderWindow";
import {toggleFiguresOverlay} from "./req/circularGenomeBuilder/toggleFiguresOverlay";
import {createHPV16Figure} from "./req/circularGenomeBuilder/createHPV16Figure";
import {closeToolBar} from "./req/closeToolBar";
import { expandHPV16FigureList } from './req/circularGenomeBuilder/expandHPV16FigureList';

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();

    await openCircularGenomeBuilderWindow();
    await toggleFiguresOverlay();
    await expandHPV16FigureList();
    await createHPV16Figure();

    await closeToolBar();
}
setTimeout(function()
{
    runTest();
},1000);