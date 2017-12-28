console.log("Started GUI test for alignment viewing");
require("./../req/main/main");

import {openProjectsView} from "./req/projectSelection/openProjectsView";
import {openFirstProject} from "./req/projectSelection/openFirstProject";
import {openOutputWindow} from "./req/output/openOutputWindow";
import {toggleOptionsPanel} from "./req/output/toggleOptionsPanel";
import {toggleMinimumCoverageCheckBox} from "./req/output/toggleMinimumCoverageCheckBox";
import {toggleMinimumVariableFrequencyCheckBox} from "./req/output/toggleMinimumVariableFrequencyCheckBox";

import {closeToolBar} from "./req/closeToolBar";

async function runTest() : Promise<void>
{
    await openProjectsView();
    await openFirstProject();
    await openOutputWindow();
    await toggleOptionsPanel();
    await toggleMinimumCoverageCheckBox();
    await toggleMinimumVariableFrequencyCheckBox();

    await closeToolBar();
}
setTimeout(function(){
    runTest();
},1000);